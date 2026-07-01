import { getCompletion } from '../ai/provider.js';

export async function inferStyleFromHistory(commits, config = {}) {
  if (!commits || commits.length === 0) return 'conventional-commits';

  const commitList = commits.join('\n');
  const systemPrompt = `You are an expert developer assistant. Your task is to analyze a list of recent git commit messages and infer the team's formatting style.
Determine rules such as:
- Are they using conventional commits (feat:, fix:)?
- Are they using gitmoji (🐛, ✨)?
- Are they writing plain English sentences?
- Is there a specific tense used (imperative vs past tense)?
- Are they capitalized?

Return a short, one-sentence instruction that can be fed into another AI prompt to enforce this style.
Do not output anything else.`;

  const prompt = `Here are the recent commits:\n\n${commitList}\n\nPlease infer the style and return the instruction.`;

  try {
    const styleInstruction = await getCompletion(prompt, systemPrompt, config);
    return styleInstruction;
  } catch (err) {
    return 'conventional-commits'; // Fallback
  }
}
