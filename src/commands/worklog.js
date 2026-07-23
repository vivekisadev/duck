import simpleGit from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import { getCompletion } from '../ai/provider.js';
import { getWorklogSystemPrompt, getWorklogPrompt } from '../ai/prompts.js';
import { loadConfig } from '../config/loadConfig.js';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs';

export async function runWorklog(range = '1 week') {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  console.log(chalk.cyan(`✓ Reading commits for range: ${range}`));
  
  let sinceDate = new Date();
  if (range.includes('week')) {
     sinceDate.setDate(sinceDate.getDate() - 7);
  } else if (range.includes('month')) {
     sinceDate.setMonth(sinceDate.getMonth() - 1);
  } else {
     // Default 1 week
     sinceDate.setDate(sinceDate.getDate() - 7);
  }
  
  const since = sinceDate.toISOString();

  let log;
  try {
     log = await git.log({ '--since': since });
  } catch (err) {
     console.log(chalk.red('Failed to get commits.'));
     return;
  }

  if (log.all.length === 0) {
     console.log(chalk.green('No commits found in this range.'));
     return;
  }

  console.log(chalk.cyan('✓ Grouping by day\n'));
  const spinner = ora('Generating worklog...').start();
  const config = await loadConfig();

  const commitList = log.all.map(c => `- [${c.date}] ${c.message}`).join('\n');

  try {
    const prompt = [
      {
        role: "system",
        content: getWorklogSystemPrompt()
      },
      {
        role: "user",
        content: getWorklogPrompt(commitList)
      }
    ];

    const summary = await getCompletion(prompt, config);
    spinner.stop();

    console.log(boxen(summary.trim(), {
      title: '🦆 Worklog',
      padding: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    }) + '\n');

    const { exportPdf } = await inquirer.prompt([{
      type: 'confirm',
      name: 'exportPdf',
      message: 'Export as markdown file? (e.g. for invoicing)',
      default: false
    }]);

    if (exportPdf) {
      fs.writeFileSync('WORKLOG.md', summary.trim());
      console.log(chalk.green('✓ Saved to WORKLOG.md!'));
    }

  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Failed to generate worklog: ${err.message}`));
  }
}
