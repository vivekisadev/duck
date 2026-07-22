import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import simpleGit from 'simple-git';

export async function installHook() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  
  if (!isRepo) {
    console.log(chalk.red('Not a git repository. Cannot install hook.'));
    return;
  }

  const hookScript = `#!/bin/sh
# Duck CLI Hook
if [ -n "$DUCK_DISABLE" ]; then exit 0; fi
# Skip if message is already provided via -m
if [ "$2" = "message" ] || [ "$2" = "commit" ]; then exit 0; fi

exec < /dev/tty
duck commit-hook "$1"
`;

  const hookPath = path.join(process.cwd(), '.git', 'hooks', 'prepare-commit-msg');
  
  try {
    await fs.writeFile(hookPath, hookScript, { mode: 0o755 });
    console.log(chalk.green('🦆 Duck hook installed successfully in .git/hooks/prepare-commit-msg'));
  } catch (err) {
    console.error(chalk.red(`Failed to install hook: ${err.message}`));
  }
}

export async function uninstallHook() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  
  if (!isRepo) {
    console.log(chalk.red('Not a git repository. Cannot uninstall hook.'));
    return;
  }

  const hookPath = path.join(process.cwd(), '.git', 'hooks', 'prepare-commit-msg');
  
  try {
    await fs.rm(hookPath);
    console.log(chalk.green('🦆 Duck hook uninstalled.'));
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(chalk.yellow('Hook not found, nothing to uninstall.'));
    } else {
      console.error(chalk.red(`Failed to uninstall hook: ${err.message}`));
    }
  }
}
