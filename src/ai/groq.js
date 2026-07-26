export async function callGroq(prompt, systemPrompt = '', config = {}) {
  const apiKey = process.env[config.apiKeyEnvVar || 'DUCK_GROQ_API_KEY'];
  if (!apiKey) {
    throw new Error('Groq API key is not set.');
  }

  const model = config.model || 'llama-3.1-8b-instant'; // Using an accessible fast model by default

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
