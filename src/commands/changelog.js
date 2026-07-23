import simpleGit from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import { getCompletion } from '../ai/provider.js';
import { getChangelogSystemPrompt, getChangelogPrompt } from '../ai/prompts.js';
import { loadConfig } from '../config/loadConfig.js';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs';

export async function runChangelog(fromTag, toTag) {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  if (!fromTag || !toTag) {
    console.log(chalk.red('Please provide --from <tag> and --to <tag>'));
    return;
  }

  console.log(chalk.cyan(`✓ Reading commits between ${fromTag} and ${toTag}`));

  let log;
  try {
     log = await git.log({ from: fromTag, to: toTag });
  } catch (err) {
     console.log(chalk.red(`Failed to get commits between ${fromTag} and ${toTag}. Ensure tags exist.`));
     return;
  }

  const commitCount = log.all.length;
  if (commitCount === 0) {
     console.log(chalk.green(`No commits found between ${fromTag} and ${toTag}.`));
     return;
  }

  console.log(chalk.cyan(`✓ Grouping by type\n`));

  const spinner = ora('Generating release notes...').start();
  const config = await loadConfig();

  const commitList = log.all.map(c => `- ${c.message}`).join('\n');

  try {
    const prompt = [
      {
        role: "system",
        content: getChangelogSystemPrompt()
      },
      {
        role: "user",
        content: getChangelogPrompt(commitList)
      }
    ];

    const changelog = await getCompletion(prompt, config);
    spinner.stop();

    console.log(boxen(changelog.trim(), {
      title: `🦆 ${toTag} Release Notes`,
      padding: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    }) + '\n');

    const { save } = await inquirer.prompt([{
      type: 'confirm',
      name: 'save',
      message: 'Save to CHANGELOG.md?',
      default: true
    }]);

    if (save) {
      let existing = '';
      if (fs.existsSync('CHANGELOG.md')) {
        existing = fs.readFileSync('CHANGELOG.md', 'utf8') + '\n\n';
      }
      fs.writeFileSync('CHANGELOG.md', existing + changelog.trim());
      console.log(chalk.green('✓ Appended to CHANGELOG.md!'));
    }

  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Failed to generate changelog: ${err.message}`));
  }
}
