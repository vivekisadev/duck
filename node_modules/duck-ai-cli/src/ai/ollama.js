export async function callOllama(prompt, systemPrompt = '', config = {}) {
  const model = config.model || 'llama3.2'; // Accessible offline model

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      system: systemPrompt,
      stream: false,
      options: {
        temperature: 0.1
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.response.trim();
}
