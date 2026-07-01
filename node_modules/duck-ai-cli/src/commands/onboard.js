import simpleGit from 'simple-git';
import chalk from 'chalk';
import { getCompletion } from '../ai/provider.js';
import { loadConfig } from '../config/loadConfig.js';
import ora from 'ora';
import fs from 'fs';

export async function runOnboard() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  console.log(chalk.cyan('✓ Reading project structure'));
  
  // Just get a top-level listing for context
  let tree = '';
  try {
    const files = await git.raw(['ls-files']);
    const topLevelDirs = new Set();
    files.split('\n').forEach(f => {
      const parts = f.split('/');
      if (parts.length > 1) topLevelDirs.add(parts[0]);
    });
    tree = `Top-level directories: ${Array.from(topLevelDirs).join(', ')}`;
  } catch (err) {}

  console.log(chalk.cyan('✓ Reading recent commit patterns and code conventions\n'));
  
  let log;
  try {
     log = await git.log({ maxCount: 50 });
  } catch (err) {
     console.log(chalk.red('Failed to read git history.'));
     return;
  }

  const commitList = log.all.map(c => `- ${c.message}`).join('\n');
  const spinner = ora('Generating ONBOARDING.md...').start();
  const config = await loadConfig();

  try {
    const prompt = [
      {
        role: "system",
        content: "You are a senior developer helping onboard a new team member. Read the project directory structure and recent commit history, and generate an ONBOARDING.md file. Include: Project structure overview, where the real logic lives vs boilerplate, commit message conventions this repo actually follows (based on the provided history), and any common patterns or gotchas found in the commits. Use markdown."
      },
      {
        role: "user",
        content: `Structure:\n${tree}\n\nRecent Commits:\n${commitList}`
      }
    ];

    const onboarding = await getCompletion(prompt, config);
    spinner.stop();

    fs.writeFileSync('ONBOARDING.md', onboarding.trim());
    console.log(chalk.green('✓ Generated ONBOARDING.md:'));
    console.log(chalk.gray('  - Project structure overview'));
    console.log(chalk.gray('  - Where the "real" logic lives vs. boilerplate'));
    console.log(chalk.gray('  - Commit message conventions this repo actually follows'));
    console.log(chalk.gray('  - Common gotchas found in recent bug-fix commits\n'));

  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Failed to generate onboarding: ${err.message}`));
  }
}
