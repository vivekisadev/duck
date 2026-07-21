import simpleGit from 'simple-git';
import chalk from 'chalk';
import { getCompletion } from '../ai/provider.js';
import { loadConfig } from '../config/loadConfig.js';
import ora from 'ora';

export async function runBlameExplain(target) {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  // Parse target: file.js:42
  const parts = target.split(':');
  if (parts.length !== 2) {
    console.log(chalk.red('Invalid target format. Use <file>:<line> (e.g. src/utils.js:42)'));
    return;
  }

  const file = parts[0];
  const line = parseInt(parts[1], 10);

  if (isNaN(line)) {
    console.log(chalk.red('Line must be a number.'));
    return;
  }

  console.log(chalk.cyan('✓ Reading commit history for this line'));
  
  let blameOutput;
  try {
    blameOutput = await git.raw(['blame', '-L', `${line},${line}`, file]);
  } catch (err) {
    console.log(chalk.red(`Failed to run git blame: ${err.message}`));
    return;
  }

  // Parse hash from blame output
  // e.g. 7f3a9c12 (John Doe 2026-07-15 10:00:00 +0000 42) const x = 1;
  const hashMatch = blameOutput.match(/^([a-f0-9]+)/);
  if (!hashMatch) {
    console.log(chalk.red('Could not parse commit hash from blame output.'));
    return;
  }
  const hash = hashMatch[1];

  console.log(chalk.cyan('✓ Reading the original commit message and diff context'));
  
  let showOutput;
  try {
    showOutput = await git.raw(['show', hash]);
  } catch (err) {
    console.log(chalk.red(`Failed to run git show: ${err.message}`));
    return;
  }

  const config = await loadConfig();
  const spinner = ora('Asking duck to explain...').start();

  try {
    const prompt = [
      {
        role: "system",
        content: "You are a Git expert. Your job is to explain WHY a specific line of code was changed based on its commit message and diff context. Keep it to one concise paragraph. Explain the intent, not just restate the code."
      },
      {
        role: "user",
        content: `Explain why line ${line} in ${file} was changed based on this commit (hash: ${hash}):\n\n${showOutput}`
      }
    ];

    const explanation = await getCompletion(prompt, config);
    
    spinner.stop();
    console.log(`\nLine ${line} was last changed in commit ${chalk.yellow(hash.substring(0, 7))}`);
    console.log('\n' + chalk.green(explanation.trim()));
  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Failed to explain: ${err.message}`));
  }
}
