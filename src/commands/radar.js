import chalk from 'chalk';
import boxen from 'boxen';
import { getRepoState } from '../git/radar.js';

export async function runRadar() {
  const state = await getRepoState();

  if (!state.isRepo) {
    console.log(chalk.red('Not a git repository. The duck is confused. 🦆❓'));
    return;
  }

  const lines = [];

  // Branch & HEAD
  lines.push(`${chalk.gray('Branch:')}       ${chalk.cyan(state.branch)}`);
  
  if (state.isDetached) {
    lines.push(`${chalk.gray('HEAD:')}         ${chalk.red('detached ⚠')}`);
  } else {
    lines.push(`${chalk.gray('HEAD:')}         ${chalk.green('attached ✓')}`);
  }

  // Remote Tracking
  if (state.tracking) {
    let remoteStatus = `${state.ahead} ahead, ${state.behind} behind ${state.tracking}`;
    if (state.ahead === 0 && state.behind === 0) remoteStatus = `up to date with ${state.tracking}`;
    lines.push(`${chalk.gray('Remote:')}       ${chalk.yellow(remoteStatus)}`);
    
    if (state.lastSynced) {
       let syncColor = state.lastSynced.includes('days') || state.lastSynced.includes('week') || state.lastSynced.includes('month') ? chalk.yellow : chalk.green;
       lines.push(`${chalk.gray('Last synced:')}  ${syncColor(state.lastSynced)}`);
    }
  } else if (!state.isDetached) {
    lines.push(`${chalk.gray('Remote:')}       ${chalk.yellow('no upstream branch')}`);
  }

  // File Status
  lines.push(`${chalk.gray('Staged:')}       ${state.staged > 0 ? chalk.green(`${state.staged} files`) : '0 files'}`);
  lines.push(`${chalk.gray('Unstaged:')}     ${state.unstaged > 0 ? chalk.yellow(`${state.unstaged} files`) : '0 files'}`);

  // Stashes
  lines.push(`${chalk.gray('Stashes:')}      ${state.stashCount > 0 ? chalk.cyan(`${state.stashCount} pending`) : '0 pending'}`);

  console.log('\n' + boxen(lines.join('\n'), {
    title: '🦆 Repo State',
    padding: 1,
    borderStyle: 'round',
    borderColor: 'blue'
  }) + '\n');
}
