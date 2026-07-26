import simpleGit from 'simple-git';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function runGoto(ref) {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  // Check if ref is a branch
  let isBranch = false;
  try {
    const branches = await git.branchLocal();
    if (branches.all.includes(ref)) {
      isBranch = true;
    }
  } catch (err) {}

  if (!isBranch) {
    console.log(chalk.red(`\n⚠ This commit isn't a branch — checking it out directly will`));
    console.log(chalk.red(`  put you in "detached HEAD." Any commits you make here won't`));
    console.log(chalk.red(`  belong to a branch and can be lost when you switch away.\n`));

    const { choice } = await inquirer.prompt([{
      type: 'select',
      name: 'choice',
      message: 'What do you want to do?',
      choices: [
        { name: 'Just look around (read-only, I won\'t commit here)', value: 'look' },
        { name: 'Create a branch here first (safe to commit)', value: 'branch' },
        { name: 'Cancel', value: 'cancel' }
      ]
    }]);

    if (choice === 'cancel') {
      console.log(chalk.yellow('Cancelled. 🦆'));
      return;
    }

    if (choice === 'branch') {
      const { branchName } = await inquirer.prompt([{
        type: 'input',
        name: 'branchName',
        message: 'Enter new branch name:',
        validate: (input) => input.trim() !== '' ? true : 'Branch name cannot be empty.'
      }]);
      
      try {
        await git.checkoutBranch(branchName, ref);
        console.log(chalk.green(`✓ Created and checked out branch ${branchName}`));
        return;
      } catch (err) {
        console.log(chalk.red(`Failed to create branch: ${err.message}`));
        return;
      }
    }
  }

  // Normal checkout (or "look around" in detached head)
  try {
    await git.checkout(ref);
    console.log(chalk.green(`✓ Checked out ${ref}`));
  } catch (err) {
    console.log(chalk.red(`Failed to checkout: ${err.message}`));
  }
}
