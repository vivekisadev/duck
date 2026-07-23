import simpleGit from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import { getCompletion } from '../ai/provider.js';
import { getStandupSystemPrompt, getStandupPrompt } from '../ai/prompts.js';
import { loadConfig } from '../config/loadConfig.js';
import inquirer from 'inquirer';
import ora from 'ora';
import clipboard from 'clipboardy';

export async function runStandup() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  // Get commits since yesterday 9am (roughly 24 hours ago for MVP)
  console.log(chalk.cyan('✓ Reading commits since yesterday'));
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const since = yesterday.toISOString();

  let log;
  try {
     log = await git.log({ '--since': since });
  } catch (err) {
     console.log(chalk.red('Failed to get commits.'));
     return;
  }

  if (log.all.length === 0) {
     console.log(chalk.green('No commits since yesterday. Take a break! 🦆'));
     return;
  }

  console.log(chalk.cyan('✓ Grouping by theme\n'));
  const spinner = ora('Generating standup summary...').start();
  const config = await loadConfig();

  const commitList = log.all.map(c => `- ${c.hash.substring(0, 7)}: ${c.message}`).join('\n');

  try {
    const prompt = [
      {
        role: "system",
        content: getStandupSystemPrompt()
      },
      {
        role: "user",
        content: getStandupPrompt(commitList)
      }
    ];

    const summary = await getCompletion(prompt, config);
    spinner.stop();

    console.log(boxen(summary.trim(), {
      title: '🦆 Yesterday\'s Work',
      padding: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    }) + '\n');

    const { copy } = await inquirer.prompt([{
      type: 'confirm',
      name: 'copy',
      message: 'Copy to clipboard?',
      default: true
    }]);

    if (copy) {
      clipboard.writeSync(summary.trim());
      console.log(chalk.green('✓ Copied to clipboard!'));
    }

  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Failed to generate standup: ${err.message}`));
  }
}
