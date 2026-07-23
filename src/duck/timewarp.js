import simpleGit from 'simple-git';
import chalk from 'chalk';
import inquirer from 'inquirer';
import boxen from 'boxen';

export async function executeTimewarp(range, commitsCount, distribution) {
  const git = simpleGit();
  const diff = await git.diff(['--staged']);
  
  if (!diff) {
    console.log(chalk.yellow('The duck needs staged changes to timewarp! 🦆🕰️'));
    return;
  }

  // 1. One-time honesty guardrail (we can just show it always for simplicity or check a file)
  console.log(chalk.bgRed.white.bold('\n 🦆 TIMEWARP NOTICE '));
  console.log(chalk.red('This changes when commits appear to have happened.'));
  console.log(chalk.red('Use it to reflect real work, not to misrepresent your timeline to others.\n'));

  // 2. Parse Range and Dates
  let startDate, endDate;
  if (range.includes(':')) {
    const parts = range.split(':');
    startDate = new Date(parts[0]);
    endDate = new Date(parts[1]);
  } else {
    startDate = new Date(range);
    endDate = new Date(range);
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.log(chalk.red('Invalid date format. Use YYYY-MM-DD or YYYY-MM-DD:YYYY-MM-DD'));
    return;
  }

  // 3. Distribute Commits
  const commitDates = [];
  const duration = endDate.getTime() - startDate.getTime();
  
  for (let i = 0; i < commitsCount; i++) {
    let offset = 0;
    if (duration > 0) {
      if (distribution === 'even') {
        offset = (duration / Math.max(1, commitsCount - 1)) * i;
      } else if (distribution === 'weighted-recent') {
        // Bias towards the end (quadratic)
        const factor = Math.pow(i / Math.max(1, commitsCount - 1), 2);
        offset = duration * factor;
      } else { // random
        offset = Math.random() * duration;
      }
    }
    
    const commitDate = new Date(startDate.getTime() + offset);
    // Add random hours if duration is at least a day to make it look natural
    if (duration > 86400000) {
       commitDate.setHours(9 + Math.floor(Math.random() * 8)); // 9 AM to 5 PM
       commitDate.setMinutes(Math.floor(Math.random() * 60));
    }
    commitDates.push(commitDate);
  }

  commitDates.sort((a, b) => a - b);

  // 4. Preview
  console.log(chalk.blue('\n--- 🦆 Timewarp Preview ---'));
  console.log(`Total commits: ${commitsCount}`);
  console.log(`Distribution: ${distribution}`);
  console.log(`Range: ${startDate.toDateString()} to ${endDate.toDateString()}\n`);
  
  commitDates.forEach((d, i) => {
    console.log(`${chalk.gray(`Commit ${i + 1}:`)} ${chalk.cyan(d.toISOString())}`);
  });
  console.log();

  const { proceed } = await inquirer.prompt([{
    type: 'confirm',
    name: 'proceed',
    message: 'Execute these backdated commits?',
    default: false
  }]);

  if (!proceed) {
    console.log(chalk.yellow('Timewarp aborted. 🦆🕰️'));
    return;
  }

  // 5. Execute
  // For MVP: if commitsCount is 1, just commit all staged.
  // If > 1, we should logically split the diff. 
  // Since splitting a diff via AI is highly complex and error-prone for a CLI MVP without actual file splitting logic,
  // we'll unstage everything, then split by files.
  
  const status = await git.status();
  const stagedFiles = status.staged;
  
  if (stagedFiles.length === 0) {
      console.log(chalk.red('No files are staged.'));
      return;
  }

  // Unstage everything first to chunk it
  await git.reset(['HEAD']);

  const filesPerCommit = Math.max(1, Math.ceil(stagedFiles.length / commitsCount));
  
  const { loadConfig } = await import('../config/loadConfig.js');
  const { generateDraftMessage } = await import('./draftMessage.js');
  const ora = (await import('ora')).default;
  const config = await loadConfig();
  
  for (let i = 0; i < commitsCount; i++) {
    const chunk = stagedFiles.slice(i * filesPerCommit, (i + 1) * filesPerCommit);
    if (chunk.length === 0) break; // No more files
    
    const commitDate = commitDates[i];
    const dateStr = commitDate.toISOString();
    
    // Stage chunk
    await git.add(chunk);
    
    // Get diff and generate AI message
    const chunkDiff = await git.diff(['--staged']);
    let commitMessage = `chore: timewarp chunk ${i + 1}\n\nFiles: ${chunk.join(', ')}`;
    
    if (chunkDiff) {
      const spinner = ora(`Drafting AI message for chunk ${i + 1}...`).start();
      try {
        const draft = await generateDraftMessage(chunkDiff, config);
        if (draft) commitMessage = draft;
        spinner.stop();
      } catch (err) {
        spinner.stop();
        console.log(chalk.yellow(`Failed AI draft for chunk ${i + 1}, using fallback.`));
      }
    }
    
    // Commit with dates using env variables.
    // Create a new simpleGit instance for the commit to ensure env vars are strictly scoped
    // and don't pollute the main instance.
    const scopedGit = (await import('simple-git')).default();
    await scopedGit.env({
      ...process.env,
      GIT_AUTHOR_DATE: dateStr,
      GIT_COMMITTER_DATE: dateStr
    }).commit(commitMessage);
             
    console.log(chalk.green(`✅ Committed chunk ${i + 1} at ${dateStr}`));
    console.log(chalk.cyan(`   Message: ${commitMessage.split('\n')[0]}`));
  }
  
  console.log(chalk.green('\nTimewarp complete! Your GitHub graph looks mighty busy. 🦆🚀'));
}
