import simpleGit from 'simple-git';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { loadConfig } from '../config/loadConfig.js';

export async function runPull() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  const status = await git.status();
  const tracking = status.tracking;

  if (!tracking) {
    console.log(chalk.red('No remote tracking branch.'));
    return;
  }

  // Fetch first to get true ahead/behind
  await git.fetch();
  const fetchedStatus = await git.status();
  const behind = fetchedStatus.behind;

  if (behind === 0) {
    console.log(chalk.green('✓ Already up to date.'));
    return;
  }

  const config = await loadConfig();
  const strategy = config.pullStrategy === 'rebase' ? 'rebase' : 'merge';

  console.log(chalk.cyan(`✓ This will ${strategy} ${behind} incoming commits into your branch`));
  console.log(chalk.gray(`  (using ${strategy} — per your .duckrc setting)`));

  // A basic check for overlap to guess conflicts. Not perfect but helpful.
  // We can look at files modified in local vs remote.
  let conflictsExpected = false;
  try {
     const remoteLog = await git.log({ from: 'HEAD', to: tracking });
     const localLog = await git.log({ from: tracking, to: 'HEAD' });
     
     // Ideally we check if they touch the same files.
     // For simplicity in MVP, we just mention we don't have a deep conflict preview yet,
     // or we just say "No obvious conflicts" if local is 0 ahead.
     if (fetchedStatus.ahead === 0) {
       console.log(chalk.green('\n  No conflicts expected (fast-forward).'));
     } else {
       console.log(chalk.yellow('\n  You have divergent commits. Conflicts are possible.'));
     }
  } catch (err) {}

  const { proceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'proceed',
    message: 'Proceed?',
    default: true
  }]);

  if (proceed) {
    try {
      const args = strategy === 'rebase' ? ['--rebase'] : [];
      await git.pull(args);
      console.log(chalk.green(`✓ Successfully pulled using ${strategy}.`));
    } catch (err) {
      console.log(chalk.red(`Merge conflict or pull failed:\n${err.message}`));
      console.log(chalk.yellow('Use `duck resolve` if you have conflicts.'));
    }
  } else {
    console.log(chalk.yellow('Pull aborted.'));
  }
}
