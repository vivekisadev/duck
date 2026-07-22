import simpleGit from 'simple-git';
import chalk from 'chalk';

export async function runFetch() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  const statusBefore = await git.status();
  const tracking = statusBefore.tracking;

  if (!tracking) {
    console.log(chalk.red('No remote tracking branch.'));
    return;
  }

  console.log(chalk.cyan('Fetching from remote...'));
  
  try {
    await git.fetch();
  } catch (err) {
    console.log(chalk.red(`Fetch failed: ${err.message}`));
    return;
  }

  const statusAfter = await git.status();
  const ahead = statusAfter.ahead;
  const behind = statusAfter.behind;

  console.log(chalk.green('\n✓ Fetching from origin (no local changes made)'));
  
  if (behind > 0) {
    console.log(chalk.yellow(`\n  ${tracking} has ${behind} new commits you don't have yet`));
  } else {
    console.log(chalk.gray(`\n  ${tracking} has no new commits`));
  }

  if (ahead > 0) {
    console.log(chalk.yellow(`  Your branch has ${ahead} commits origin doesn't have`));
  } else {
    console.log(chalk.gray(`  Your branch has no unique commits`));
  }

  console.log(chalk.gray('\n  Nothing on your machine changed — this was read-only.'));
  console.log(chalk.gray('  Run `duck pull` when you\'re ready to bring those in.'));
}
