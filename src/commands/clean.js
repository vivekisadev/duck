import simpleGit from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import inquirer from 'inquirer';

export async function runClean() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  console.log(chalk.cyan('✓ Scanning local branches'));
  console.log(chalk.cyan('✓ Checking merge status against main/master\n'));

  let branches;
  try {
    branches = await git.branchLocal();
  } catch (err) {
    console.log(chalk.red(`Failed to get branches: ${err.message}`));
    return;
  }

  const current = branches.current;
  const allBranches = branches.all.filter(b => b !== current && b !== 'main' && b !== 'master');

  const safeToDelete = [];
  const needsLook = [];

  for (const b of allBranches) {
    // Check if merged into current (or main)
    // We'll check if the branch is merged into HEAD
    try {
      const mergedBranches = await git.branch(['--merged', 'HEAD']);
      if (mergedBranches.all.includes(b)) {
        safeToDelete.push(b);
      } else {
        needsLook.push(b);
      }
    } catch (err) {
      needsLook.push(b);
    }
  }

  const lines = [];
  lines.push(chalk.gray('Safe to delete (merged, no unique commits):'));
  if (safeToDelete.length > 0) {
     safeToDelete.forEach(b => lines.push(`  ${chalk.green('✓')} ${b}`));
  } else {
     lines.push(`  None`);
  }

  lines.push('');
  lines.push(chalk.gray('Needs a look (unmerged, but stale):'));
  if (needsLook.length > 0) {
     needsLook.forEach(b => lines.push(`  ${chalk.yellow('⚠')} ${b}`));
  } else {
     lines.push(`  None`);
  }

  console.log(boxen(lines.join('\n'), {
    title: '🦆 Branch Report',
    padding: 1,
    borderStyle: 'round',
    borderColor: 'blue'
  }) + '\n');

  if (safeToDelete.length > 0) {
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: `Delete the ${safeToDelete.length} safe branches?`,
      default: false
    }]);

    if (proceed) {
      for (const b of safeToDelete) {
         try {
           await git.deleteLocalBranch(b);
           console.log(chalk.green(`✓ Deleted ${b}`));
         } catch (err) {
           console.log(chalk.red(`Failed to delete ${b}: ${err.message}`));
         }
      }
    } else {
      console.log(chalk.yellow('Branch deletion aborted.'));
    }
  }
}
