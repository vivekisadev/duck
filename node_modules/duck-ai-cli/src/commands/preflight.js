import simpleGit from 'simple-git';
import chalk from 'chalk';
import boxen from 'boxen';
import inquirer from 'inquirer';

export async function runPreflight() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  console.log(chalk.cyan('✓ Scanning staged + unstaged changes'));

  // Get both staged and unstaged diff
  let diff = '';
  try {
    diff = await git.diff(); // unstaged
    diff += '\n' + await git.diff(['--staged']); // staged
  } catch (err) {
    console.log(chalk.red(`Failed to get diff: ${err.message}`));
    return;
  }

  const warnings = [];
  
  // Very basic parsing to find warnings in added lines
  const lines = diff.split('\n');
  let currentFile = '';
  let lineNum = 0;

  for (let line of lines) {
    if (line.startsWith('diff --git a/')) {
      // Very naive parsing of file name
      currentFile = line.split(' b/')[1];
      lineNum = 0;
    } else if (line.startsWith('@@ ')) {
      // Extract starting line number for the new hunk
      // Format: @@ -10,5 +10,6 @@
      const match = line.match(/\+([0-9]+)/);
      if (match) {
        lineNum = parseInt(match[1], 10) - 1;
      }
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      lineNum++;
      const addedContent = line.substring(1).trim();

      // Check console.log
      if (addedContent.includes('console.log(') || addedContent.includes('console.error(')) {
        warnings.push(`${chalk.yellow('⚠')} ${currentFile}:${lineNum} — console.log left in`);
      }

      // Check TODO
      if (addedContent.includes('TODO:')) {
        warnings.push(`${chalk.yellow('⚠')} ${currentFile}:${lineNum} — unresolved TODO`);
      }

      // Check commented block (heuristic: line starts with multiple // or /* and is long)
      // This is a naive heuristic for MVP.
      if (addedContent.startsWith('//') && addedContent.length > 50) {
         warnings.push(`${chalk.yellow('⚠')} ${currentFile}:${lineNum} — long commented-out line`);
      }
    } else if (!line.startsWith('-')) {
      // Context line, just increment line number
      lineNum++;
    }
  }

  if (warnings.length > 0) {
    console.log('\n' + boxen(warnings.join('\n'), {
      title: '🦆 Preflight Warnings',
      padding: 1,
      borderStyle: 'round',
      borderColor: 'yellow'
    }) + '\n');

    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Push anyway?',
      default: false
    }]);

    if (proceed) {
      console.log(chalk.cyan('Pushing...'));
      try {
        await git.push();
        console.log(chalk.green('✓ Push successful.'));
      } catch (err) {
        console.log(chalk.red(`Push failed: ${err.message}`));
      }
    } else {
      console.log(chalk.yellow('Push aborted. Clean up those warnings! 🦆🔧'));
    }
  } else {
    console.log(chalk.green('\n✓ Preflight clear. No obvious debug leftovers found.'));
  }
}
