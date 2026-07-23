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

  const config = await (async () => {
    const { loadConfig } = await import('../config/loadConfig.js');
    return await loadConfig();
  })();
  
  const spinner = (await import('ora')).default('Duck is scanning diff for leftovers...').start();
  let aiResponse = '';
  
  try {
    const { getCompletion } = await import('../ai/provider.js');
    const { getPreflightSystemPrompt, getPreflightPrompt } = await import('../ai/prompts.js');
    
    const prompt = [
      {
        role: "system",
        content: getPreflightSystemPrompt()
      },
      {
        role: "user",
        content: getPreflightPrompt(diff)
      }
    ];

    aiResponse = await getCompletion(prompt, config);
    spinner.stop();
  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Failed to run AI scan: ${err.message}`));
    return;
  }
  
  const warnings = aiResponse.trim();
  const isClean = warnings === 'CLEAN';

  if (!isClean) {
    console.log('\n' + boxen(warnings, {
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
