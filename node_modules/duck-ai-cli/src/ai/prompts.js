export function getDraftSystemPrompt(config = {}) {
  const style = config.style || 'conventional-commits';
  
  let styleInstruction = 'Follow the Conventional Commits specification (e.g., feat: ..., fix: ..., chore: ...).';
  if (style === 'gitmoji') {
    styleInstruction = 'Start the message with an appropriate gitmoji, followed by a short description.';
  } else if (style === 'plain') {
    styleInstruction = 'Write a plain English sentence, capitalized, with no prefix.';
  } else if (style !== 'conventional-commits') {
    // If it's a custom style instruction (from auto style matcher or config)
    styleInstruction = `Follow this custom style rule strictly: ${style}`;
  }

  return `You are an expert developer assistant. Your task is to write a git commit message based on the provided diff.
- The first line must be under 72 characters.
- Add an optional body if the change requires explanation, separated by a blank line.
- Do not invent details not present in the diff.
- Output ONLY the commit message, without any markdown formatting or extra text.
- ${styleInstruction}`;
}

export function getDraftPrompt(diff) {
  return `Here is the staged git diff:\n\n${diff}\n\nPlease generate a commit message for these changes.`;
}

export function getAmbiguitySystemPrompt(config = {}) {
  const personality = config.duckPersonality || 'neutral';
  
  let personalityInstruction = 'Be clear and concise.';
  if (personality === 'strict-senior-dev') {
    personalityInstruction = 'Be direct and slightly demanding, like a senior developer who wants code quality.';
  } else if (personality === 'sarcastic') {
    personalityInstruction = 'Be sarcastic and witty.';
  } else if (personality === 'encouraging') {
    personalityInstruction = 'Be encouraging and supportive.';
  }

  return `You are reviewing a git diff. Your job is to detect if there is any ambiguity that requires clarification before committing.
Ambiguity includes:
- Removed validations or checks without obvious reasons.
- Magic numbers or hardcoded values added without context.
- Function/variable renames with unclear intent.
- Major logic changes where the "why" is missing.

If the diff is trivial (formatting, straightforward fixes), it is not ambiguous.

Return a JSON object strictly in this format:
{
  "needsQuestion": boolean,
  "question": "The clarifying question to ask the developer (keep it short)",
  "reason": "Why you are asking this question"
}

${personalityInstruction}`;
}

export function getAmbiguityPrompt(diff) {
  return `Analyze this diff for ambiguity:\n\n${diff}`;
}

export function getFinalMessageSystemPrompt(config = {}) {
  const basePrompt = getDraftSystemPrompt(config);
  return `${basePrompt}\n\nYou will be provided with the original diff, a draft commit message, a clarifying question asked to the developer, and the developer's answer. Synthesize this information into a final, polished commit message.`;
}

export function getFinalMessagePrompt(diff, draft, question, answer) {
  return `Diff:\n${diff}\n\nOriginal Draft:\n${draft}\n\nQuestion asked to developer:\n${question}\n\nDeveloper's answer:\n${answer}\n\nPlease output the final revised commit message based on this new context.`;
}

export function stashExplainPrompt(diff) {
  return [
    {
      role: "system",
      content: "You are a Git expert. Your job is to explain the intent and contents of a git stash diff in one or two short, plain-English sentences. DO NOT just list what changed; explain what the developer was trying to do. For example: 'Half-finished dark mode toggle in Settings.jsx' or 'Debugging attempt for the CSV export bug — added console.logs'. Keep it concise and readable. Return ONLY the explanation."
    },
    {
      role: "user",
      content: `Here is the stash diff:\n\n${diff}`
    }
  ];
}
