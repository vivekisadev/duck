import { getCompletion } from '../ai/provider.js';

export async function generateWeeklyDigest(commits, config = {}) {
  if (!commits || commits.length === 0) {
    return 'No commits found in the last 7 days. The duck has been resting! 🦆💤';
  }

  const commitList = commits.map(c => `- ${c.hash.substring(0, 7)} ${c.message}`).join('\n');
  
  const systemPrompt = `You are a helpful assistant that summarizes git commits.
Given a list of commits from the past week, write a short, human-readable paragraph summarizing what was built, fixed, or changed.
Keep it concise and focus on the big picture. Mention the total number of commits.`;

  const prompt = `Here are the commits from the past week:\n\n${commitList}\n\nPlease provide a weekly digest summary.`;

  const digest = await getCompletion(prompt, systemPrompt, config);
  return digest;
}
