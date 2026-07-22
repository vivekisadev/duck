import simpleGit from 'simple-git';
import chalk from 'chalk';
import { getCompletion } from '../ai/provider.js';
import { loadConfig } from '../config/loadConfig.js';
import { stashExplainPrompt } from '../ai/prompts.js';
import ora from 'ora';

export async function runStashExplain() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  const stashes = await git.stashList();
  if (stashes.all.length === 0) {
    console.log(chalk.green('No stashes found.'));
    return;
  }

  console.log(chalk.cyan('✓ Reading stash diffs\n'));

  const config = await loadConfig();

  for (let i = 0; i < stashes.all.length; i++) {
    const stash = stashes.all[i];
    const stashIndex = `stash@{${i}}`;
    const spinner = ora(`Analyzing ${stashIndex}...`).start();

    try {
      // Get the diff for this stash. Stash is a merge commit, so we look at the diff against its first parent.
      // git stash show -p stash@{0}
      const diff = await git.raw(['stash', 'show', '-p', stashIndex]);

      if (!diff || diff.trim() === '') {
         spinner.stop();
         console.log(chalk.yellow(`${stashIndex}: Empty stash or could not read diff.`));
         continue;
      }

      const prompt = stashExplainPrompt(diff);
      const explanation = await getCompletion(prompt, config);
      
      spinner.stop();
      console.log(chalk.green(`${stashIndex}: `) + chalk.white(explanation.trim().replace(/\n/g, '\n            ')));
    } catch (err) {
      spinner.stop();
      console.log(chalk.red(`${stashIndex}: Failed to analyze - ${err.message}`));
    }
  }
}
