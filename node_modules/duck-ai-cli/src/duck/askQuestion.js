import inquirer from 'inquirer';
import chalk from 'chalk';

export async function askQuestion(questionText) {
  console.log(chalk.yellow('\n💬 🦆 The duck has a question about your changes:'));
  
  const { answer } = await inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: chalk.cyan(questionText),
      validate: (input) => input.trim() !== '' ? true : 'Please provide an answer.'
    }
  ]);
  
  return answer;
}
