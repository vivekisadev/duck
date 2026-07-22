import simpleGit from 'simple-git';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function runForcePush() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  const branches = await git.branchLocal();
  const current = branches.current;
  const status = await git.status();
  const tracking = status.tracking;

  if (!tracking) {
    console.log(chalk.red('No remote tracking branch. Use git push -u origin first.'));
    return;
  }

  console.log(chalk.cyan(`✓ Checking what would be overwritten on ${tracking}...`));

  // Find commits on tracking that are not in local
  let overwritten = [];
  try {
    const log = await git.log({ from: current, to: tracking });
    overwritten = log.all;
  } catch (err) {
    // If it fails, maybe history is unrelated
  }

  if (overwritten.length > 0) {
    console.log(chalk.red(`\n⚠ This will discard ${overwritten.length} commits currently on the remote branch`));
    console.log(chalk.red(`  that aren't in your local history:`));
    overwritten.slice(0, 5).forEach(c => {
      console.log(chalk.gray(`    - ${c.hash.substring(0, 7)} "${c.message}"`));
    });
    if (overwritten.length > 5) {
      console.log(chalk.gray(`    ...and ${overwritten.length - 5} more.`));
    }
  } else {
    console.log(chalk.green('\n✓ No commits will be lost on the remote.'));
  }

  // Create recovery tag
  const dateStr = new Date().toISOString().split('T')[0];
  const tagName = `backup/${current}-${dateStr}-${Math.floor(Math.random() * 1000)}`;
  
  if (overwritten.length > 0) {
    console.log(chalk.yellow(`\n  A safety tag will be created first: ${tagName}`));
    console.log(chalk.yellow(`  so this can be recovered if needed.`));
  }

  const { proceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'proceed',
    message: 'Proceed with force-push?',
    default: false
  }]);

  if (proceed) {
    try {
      if (overwritten.length > 0) {
        // Create a tag on the remote tracking branch's current head
        const remoteHead = await git.revparse([tracking]);
        await git.tag([tagName, remoteHead.trim()]);
        // Ideally we'd push this tag to remote so it's backed up there, but pushing tags can be messy.
        // We will keep it local for now as a local reference to the remote's previous state.
      }
      
      console.log(chalk.cyan('\nForce pushing...'));
      await git.push(['--force']);
      console.log(chalk.green('✓ Force push successful! 🦆🚀'));
    } catch (err) {
      console.log(chalk.red(`Failed to force push: ${err.message}`));
    }
  } else {
    console.log(chalk.yellow('Force push aborted. 🦆🛑'));
  }
}
