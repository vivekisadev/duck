export default {
  async fetch(request, env, ctx) {
    // 1. Basic Abuse Mitigation
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const installId = request.headers.get('x-install-id');
    if (!installId) {
      return new Response('Missing install ID', { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response('Invalid JSON', { status: 400 });
    }

    // 2. MULTI-PROVIDER FALLBACK ROTATION (Server-Side)
    // Priority order based on MULTI-PROVIDER-FALLBACK-STRATEGY.md
    const providers = [
      { 
        name: 'groq', 
        url: 'https://api.groq.com/openai/v1/chat/completions', 
        key: env.GROQ_KEY, 
        model: 'llama-3.3-70b-versatile' 
      },
      { 
        name: 'groq-instant', 
        url: 'https://api.groq.com/openai/v1/chat/completions', 
        key: env.GROQ_KEY, 
        model: 'llama-3.1-8b-instant' 
      },
      { 
        name: 'cerebras', 
        url: 'https://api.cerebras.ai/v1/chat/completions', 
        key: env.CEREBRAS_KEY, 
        model: 'llama3.1-8b' 
      },
      {
        name: 'mistral',
        url: 'https://api.mistral.ai/v1/chat/completions',
        key: env.MISTRAL_KEY,
        model: 'mistral-small-latest'
      }
    ];

    for (const provider of providers) {
      if (!provider.key) continue; // Skip if backend env var isn't set

      try {
        const res = await fetch(provider.url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: provider.model,
            messages: [
              { role: 'system', content: body.systemPrompt || '' },
              { role: 'user', content: body.prompt }
            ],
            temperature: 0.1
          })
        });

        if (res.status === 429) {
          // Rate limited, automatically waddle to the next provider!
          console.log(`[Relay] Provider ${provider.name} rate limited. Rotating...`);
          continue; 
        }

        if (res.ok) {
          const data = await res.json();
          // Admin Panel Logging would go here (incrementing KV store per installId/provider)
          return Response.json({ status: 'success', content: data.choices[0].message.content.trim(), provider: provider.name });
        }
      } catch (err) {
        // Network error talking to this provider, try next
        continue;
      }
    }

    // 3. Exhausted State
    // If we made it here, all configured providers failed or rate-limited us
    // We explicitly return "exhausted" to trigger the CLI fallback prompt
    return Response.json({ status: 'exhausted' });
  }
};
