import chalk from 'chalk';
import inquirer from 'inquirer';
import { getRepoState } from '../git/radar.js';
import simpleGit from 'simple-git';

export async function runSyncCheck(config = {}) {
  const state = await getRepoState();
  if (!state.isRepo || !state.tracking) {
    return; // Can only sync-check if tracking a remote
  }

  const threshold = config.syncThreshold || 10;
  
  if (state.behind >= threshold || (state.lastSynced && state.lastSynced.includes('days'))) {
    console.log(chalk.yellow('✓ Comparing local branch against ' + state.tracking));
    console.log(chalk.red(`\n⚠ Your branch is ${state.behind} commits behind ${state.tracking}`));
    if (state.lastSynced) {
      console.log(chalk.red(`  (last synced ${state.lastSynced})`));
    }

    console.log(chalk.yellow('\n  Recommend pulling before continuing — the longer this'));
    console.log(chalk.yellow('  gap grows, the harder the eventual merge/rebase gets.\n'));

    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Pull now?',
      default: true
    }]);

    if (proceed) {
       const git = simpleGit();
       console.log(chalk.cyan('\nPulling...'));
       try {
         await git.pull();
         console.log(chalk.green('✓ Successfully pulled from upstream.'));
       } catch (err) {
         console.log(chalk.red(`Failed to pull: ${err.message}`));
       }
    }
  } else {
    console.log(chalk.green(`✓ Local branch is in sync with ${state.tracking} (behind by ${state.behind}).`));
  }
}
