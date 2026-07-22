import simpleGit from 'simple-git';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function runReset(target) {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  // Count discarded commits
  let discardedCount = 0;
  try {
    const log = await git.log({ from: target, to: 'HEAD' });
    discardedCount = log.all.length;
  } catch (err) {
    console.log(chalk.red(`Failed to resolve target ${target}.`));
    return;
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const tagName = `backup/before-reset-${dateStr}-${Math.floor(Math.random() * 1000)}`;

  console.log(chalk.red(`\n⚠ This will discard ${discardedCount} local commits and all uncommitted changes.`));
  console.log(chalk.yellow(`  A recovery tag will be created: ${tagName}`));
  console.log(chalk.yellow(`  (recover anytime with: git reset --hard ${tagName})\n`));

  const { proceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'proceed',
    message: 'Proceed with hard reset?',
    default: false
  }]);

  if (proceed) {
    try {
      await git.tag([tagName, 'HEAD']);
      await git.reset(['--hard', target]);
      console.log(chalk.green(`✓ Reset to ${target} successful.`));
    } catch (err) {
      console.log(chalk.red(`Failed to reset: ${err.message}`));
    }
  } else {
    console.log(chalk.yellow('Reset aborted. 🦆🛑'));
  }
}
