import { getCompletion } from '../ai/provider.js';
import { getAmbiguitySystemPrompt, getAmbiguityPrompt } from '../ai/prompts.js';

export async function detectAmbiguity(diff, config = {}) {
  const systemPrompt = getAmbiguitySystemPrompt(config);
  const prompt = getAmbiguityPrompt(diff);

  const response = await getCompletion(prompt, systemPrompt, config);
  
  try {
    // Attempt to extract JSON if wrapped in markdown
    const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : response;
    
    return JSON.parse(jsonString);
  } catch (err) {
    // If we fail to parse, default to no question to avoid blocking the workflow
    console.warn('[Duck Warning] Failed to parse ambiguity JSON. Assuming no question needed.');
    return { needsQuestion: false };
  }
}
