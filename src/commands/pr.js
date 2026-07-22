import simpleGit from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import { getCompletion } from '../ai/provider.js';
import { loadConfig } from '../config/loadConfig.js';
import inquirer from 'inquirer';
import ora from 'ora';

export async function runPr() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  const branches = await git.branchLocal();
  const current = branches.current;

  if (current === 'main' || current === 'master') {
    console.log(chalk.yellow('You are on the main branch. Checkout a feature branch to draft a PR.'));
    return;
  }

  const base = branches.all.includes('main') ? 'main' : 'master';

  console.log(chalk.cyan(`✓ Comparing ${current} against ${base}`));

  let log;
  try {
     log = await git.log({ from: base, to: current });
  } catch (err) {
     console.log(chalk.red('Failed to get commits for PR.'));
     return;
  }

  const commitCount = log.all.length;
  if (commitCount === 0) {
     console.log(chalk.green(`No unique commits on ${current} compared to ${base}.`));
     return;
  }

  console.log(chalk.cyan(`✓ Reading ${commitCount} commits`));
  console.log(chalk.cyan(`✓ Drafting description\n`));

  const spinner = ora('Generating PR draft...').start();
  const config = await loadConfig();

  const commitList = log.all.map(c => `- ${c.message}`).join('\n');

  try {
    const prompt = [
      {
        role: "system",
        content: "You are a developer assistant. Read this list of git commits from a feature branch and draft a full Pull Request description. Include the following sections: ## What (brief summary), ## Why (intent/context), ## Testing (how it was tested or should be tested), and ## Notes for reviewer. Use markdown formatting."
      },
      {
        role: "user",
        content: `Commits on this branch:\n${commitList}`
      }
    ];

    const description = await getCompletion(prompt, config);
    spinner.stop();

    console.log(boxen(description.trim(), {
      title: '🦆 Pull Request Draft',
      padding: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    }) + '\n');

    // In a real version, we could use 'open' package to open GitHub/GitLab PR URL.
    const { openBrowser } = await inquirer.prompt([{
      type: 'confirm',
      name: 'openBrowser',
      message: 'Open in browser to create PR with this description? (Simulated for now)',
      default: false
    }]);

    if (openBrowser) {
      console.log(chalk.green('✓ Imagine a browser just opened to your repo!'));
    }

  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Failed to generate PR: ${err.message}`));
  }
}
