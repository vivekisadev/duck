import { getCompletion } from '../ai/provider.js';
import { getDraftSystemPrompt, getDraftPrompt, getFinalMessageSystemPrompt, getFinalMessagePrompt } from '../ai/prompts.js';

export async function generateDraftMessage(diff, config = {}) {
  const systemPrompt = getDraftSystemPrompt(config);
  const prompt = getDraftPrompt(diff);

  const draft = await getCompletion(prompt, systemPrompt, config);
  return draft;
}

export async function generateFinalMessage(diff, draft, question, answer, config = {}) {
  const systemPrompt = getFinalMessageSystemPrompt(config);
  const prompt = getFinalMessagePrompt(diff, draft, question, answer);

  const finalMessage = await getCompletion(prompt, systemPrompt, config);
  return finalMessage;
}

