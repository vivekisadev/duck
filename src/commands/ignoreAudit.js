import simpleGit from 'simple-git';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';

const COMMON_IGNORE_PATTERNS = [
  'node_modules/',
  'dist/',
  'build/',
  '.env',
  '.DS_Store',
  'coverage/',
  '*.log'
];

export async function runIgnoreAudit() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  console.log(chalk.cyan('✓ Checking tracked files against common ignore patterns\n'));

  let trackedFiles = [];
  try {
    const output = await git.raw(['ls-files']);
    trackedFiles = output.split('\n').filter(Boolean);
  } catch (err) {
    console.log(chalk.red('Failed to list tracked files.'));
    return;
  }

  const flagged = [];

  for (const file of trackedFiles) {
    if (file.includes('node_modules/')) {
      if (!flagged.includes('node_modules/')) flagged.push('node_modules/');
    } else if (file.includes('dist/')) {
      if (!flagged.includes('dist/')) flagged.push('dist/');
    } else if (file.includes('build/')) {
      if (!flagged.includes('build/')) flagged.push('build/');
    } else if (file.includes('.env')) {
      flagged.push(file);
    } else if (file.includes('.DS_Store')) {
      flagged.push(file);
    } else if (file.endsWith('.log')) {
      flagged.push(file);
    } else if (file.includes('coverage/')) {
       if (!flagged.includes('coverage/')) flagged.push('coverage/');
    }
  }

  if (flagged.length > 0) {
    console.log(chalk.red('⚠ These look like they shouldn\'t be tracked:'));
    flagged.forEach(f => console.log(chalk.red(`    ${f}`)));

    console.log('');
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Add these to .gitignore and untrack them now?',
      default: false
    }]);

    if (proceed) {
      try {
        let gitignore = '';
        if (fs.existsSync('.gitignore')) {
          gitignore = fs.readFileSync('.gitignore', 'utf8') + '\n';
        }
        
        const toAdd = flagged.filter(f => !gitignore.includes(f));
        if (toAdd.length > 0) {
          fs.writeFileSync('.gitignore', gitignore + toAdd.join('\n') + '\n');
        }

        // Untrack them (without deleting from disk)
        console.log(chalk.cyan('Untracking files...'));
        for (const f of flagged) {
           await git.rm(['--cached', '-r', f, '--ignore-unmatch']);
        }

        console.log(chalk.green('✓ Added to .gitignore and untracked. Run `git commit` to save this change.'));
      } catch (err) {
        console.log(chalk.red(`Failed to untrack: ${err.message}`));
      }
    } else {
      console.log(chalk.yellow('Skipped.'));
    }
  } else {
    console.log(chalk.green('✓ No obviously bad files are tracked.'));
  }
}
