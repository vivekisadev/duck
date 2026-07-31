import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function runInit() {
  console.log(chalk.cyan("🦆 Let's set up your duck flock!"));

  const answers = await inquirer.prompt([
    {
      type: 'select',
      name: 'scope',
      message: 'Where should this configuration live?',
      choices: [
        { name: 'Local (just for this project, ./.duckrc)', value: 'local' },
        { name: 'Global (for all your projects, ~/.duckrc)', value: 'global' }
      ]
    },
    {
      type: 'select',
      name: 'provider',
      message: 'Which AI Provider do you want to use?',
      choices: [
        { name: 'Groq (Fastest, default)', value: 'groq' },
        { name: 'Ollama (Local offline models)', value: 'ollama' }
      ]
    },
    {
      type: 'input',
      name: 'model',
      message: 'Which model should be used?',
      default: (ans) => ans.provider === 'groq' ? 'llama-3.1-8b-instant' : 'llama3'
    },
    {
      type: 'select',
      name: 'style',
      message: 'How should commit messages be styled?',
      choices: [
        { name: 'Conventional Commits (feat:, fix:, chore:)', value: 'conventional-commits' },
        { name: 'Gitmoji (✨ feat, 🐛 fix)', value: 'gitmoji' },
        { name: 'Plain (Capitalized sentence)', value: 'plain' },
        { name: 'Auto (Infer from project history)', value: 'auto' }
      ]
    },
    {
      type: 'select',
      name: 'duckPersonality',
      message: 'What personality should the Duck have during ambiguity checks?',
      choices: [
        { name: 'Neutral (Professional)', value: 'neutral' },
        { name: 'Duck (Helpful with subtle duck puns)', value: 'duck' },
        { name: 'Strict Senior Dev (Demanding code quality)', value: 'strict-senior-dev' },
        { name: 'Sarcastic (Witty and cynical)', value: 'sarcastic' }
      ]
    }
  ]);

  const configPath = answers.scope === 'global'
    ? path.join(os.homedir(), '.duckrc')
    : path.join(process.cwd(), '.duckrc');

  const configObj = {
    provider: answers.provider,
    model: answers.model,
    style: answers.style,
    duckPersonality: answers.duckPersonality,
    apiKeyEnvVar: answers.provider === 'groq' ? 'DUCK_GROQ_API_KEY' : undefined
  };

  try {
    await fs.writeFile(configPath, JSON.stringify(configObj, null, 2), 'utf8');
    console.log(chalk.green(`\n✨ Success! Configuration saved to ${configPath}`));
    console.log(chalk.blue('You can now run `duck commit` to see it in action! 🦆💨\n'));
  } catch (err) {
    console.error(chalk.red(`\n❌ Failed to write config: ${err.message}`));
  }
}
