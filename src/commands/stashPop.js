import simpleGit from 'simple-git';
import chalk from 'chalk';
import inquirer from 'inquirer';

export async function runStashPop(stashId = 'stash@{0}') {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  console.log(chalk.cyan(`✓ Simulating pop for ${stashId}...`));

  let applySuccess = false;
  try {
    await git.raw(['stash', 'apply', stashId]);
    applySuccess = true;
  } catch (err) {
    // Git stash apply failed. It could be conflicts, or it could be overlapping uncommitted changes.
  }

  if (applySuccess) {
    // It applied cleanly without conflicts! Now just drop it to complete the "pop".
    try {
      await git.raw(['stash', 'drop', stashId]);
      console.log(chalk.green(`✓ Successfully popped ${stashId} with no conflicts!`));
    } catch (dropErr) {
      console.log(chalk.yellow(`✓ Applied ${stashId} successfully, but could not drop it.`));
    }
    return;
  }

  // If we got here, it threw an error. Let's see if it's because of merge conflicts.
  const unmerged = await git.raw(['ls-files', '-u']);
  if (!unmerged.trim()) {
    // No conflict markers. This means Git aborted entirely (e.g. overlapping uncommitted changes).
    console.log(chalk.red(`⚠ Could not apply stash. Git aborted to protect your uncommitted changes:`));
    try {
      // Just run it again to get the exact error message printed to user safely
      const { spawnSync } = await import('child_process');
      spawnSync('git', ['stash', 'apply', stashId], { stdio: 'inherit' });
    } catch(e) {}
    return;
  }

  // We have conflicts! Abort the merge to restore their working directory to exactly how it was
  await git.raw(['reset', '--merge']);

  // Extract conflicted files
  const conflictedFiles = [...new Set(unmerged.trim().split('\n').map(l => l.split('\t')[1]))];

  console.log(chalk.yellow(`\n⚠ WARNING: Popping this stash will cause ${conflictedFiles.length} merge conflict${conflictedFiles.length > 1 ? 's' : ''}:`));
  conflictedFiles.forEach(f => console.log(chalk.yellow(`  - ${f}`)));
  console.log('');

  // Interactive menu
  let keepPrompting = true;
  while (keepPrompting) {
    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'Would you like to:',
      choices: [
        { name: 'View the diff of the stash before popping', value: 'diff' },
        { name: 'Pop anyway and resolve conflicts', value: 'pop' },
        { name: 'Cancel and keep working tree clean', value: 'cancel' }
      ]
    }]);

    if (action === 'diff') {
      const { spawnSync } = await import('child_process');
      spawnSync('git', ['stash', 'show', '-p', stashId], { stdio: 'inherit' });
      console.log(''); // extra line for neatness
    } else if (action === 'pop') {
      console.log(chalk.cyan(`\nApplying ${stashId}...`));
      const { spawnSync } = await import('child_process');
      spawnSync('git', ['stash', 'pop', stashId], { stdio: 'inherit' });
      keepPrompting = false;
    } else if (action === 'cancel') {
      console.log(chalk.green('\n✓ Canceled. Your working tree is unchanged.'));
      keepPrompting = false;
    }
  }
}
