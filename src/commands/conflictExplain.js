import simpleGit from 'simple-git';
import chalk from 'chalk';
import { getCompletion } from '../ai/provider.js';
import { loadConfig } from '../config/loadConfig.js';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs';

export async function runResolve() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  // Get conflicting files
  const status = await git.status();
  const conflicts = status.conflicted;

  if (conflicts.length === 0) {
    console.log(chalk.green('No conflicts to resolve.'));
    return;
  }

  console.log(chalk.cyan(`✓ Found ${conflicts.length} conflicting files — walking through them one at a time\n`));

  const config = await loadConfig();

  for (let i = 0; i < conflicts.length; i++) {
    const file = conflicts[i];
    console.log(chalk.yellow(`[${i + 1}/${conflicts.length}] ${file}`));
    
    const spinner = ora('Analyzing branches for this file...').start();
    let explanation = '';
    
    try {
      // In a real conflict, git puts <<<<<<< ======= >>>>>>> markers.
      // We can pass the raw file with markers to the AI.
      const content = fs.readFileSync(file, 'utf8');
      
      const prompt = [
        {
          role: "system",
          content: "You are a Git expert. A developer has a merge conflict in the provided file. Read the <<<<<<<, =======, and >>>>>>> markers. Explain WHY the two branches diverged in plain English, and suggest whether they should keep both, or pick one side. Keep the explanation concise (2-3 sentences)."
        },
        {
          role: "user",
          content: `Here is the conflicted file content:\n\n${content}`
        }
      ];

      explanation = await getCompletion(prompt, config);
      spinner.stop();
      console.log(chalk.green(explanation.trim()) + '\n');
    } catch (err) {
      spinner.stop();
      console.log(chalk.red(`Failed to analyze: ${err.message}`));
    }

    const { choice } = await inquirer.prompt([{
      type: 'list',
      name: 'choice',
      message: 'What do you want to do?',
      choices: [
        { name: 'Show me the raw diff', value: 'diff' },
        { name: 'Skip for now', value: 'skip' }
      ]
    }]);

    if (choice === 'diff') {
       try {
         const diff = await git.raw(['diff', '--cc', file]);
         console.log('\n' + diff + '\n');
       } catch (err) {
         console.log(chalk.red('Failed to show diff.'));
       }
    }
    
    console.log('');
  }
  
  console.log(chalk.cyan('Run `git add <file>` when you manually resolve them, then `git commit`.'));
}
