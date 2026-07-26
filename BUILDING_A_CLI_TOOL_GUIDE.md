# How to Build a CLI Tool in Node.js (The Duck CLI Guide)

This document is a comprehensive, beginner-friendly guide that explains exactly how a Command Line Interface (CLI) tool like **Duck CLI** is built from scratch. If you are asked in an interview or by a colleague how you made this tool, this document will give you the complete mental model.

---

## 1. What is a CLI Tool?

A Command Line Interface (CLI) tool is simply a program that runs in the terminal instead of a web browser. Instead of clicking buttons, the user interacts with it by typing text (like `npm install` or `git commit`). 

In the Node.js ecosystem, CLI tools are just normal JavaScript files that run on your machine's local Node environment, but they are packaged in a way that allows the operating system to execute them globally as a command.

---

## 2. The Core Mechanics: How does the computer know what "duck" means?

When a user types `duck` into their terminal, how does the computer know to run your JavaScript code? This is achieved through three key mechanisms:

### A. The `package.json` "bin" Field
In your `package.json`, there is a special field called `"bin"`. This tells the NPM package manager: *"When someone installs this package, take this file and register it as a system command."*

```json
  "bin": {
    "duck": "./bin/duck.js"
  }
```
*When NPM sees this, it creates a shortcut (symlink) on the user's operating system. Now, typing `duck` points directly to `./bin/duck.js`.*

### B. The "Shebang" (`#!/usr/bin/env node`)
If you open `./bin/duck.js`, the very first line of code isn't JavaScript. It's a comment that looks like this:
```javascript
#!/usr/bin/env node
```
This is called a **Shebang**. Because terminal scripts can be written in Python, Bash, Ruby, or Node, the operating system doesn't inherently know how to read your file. The shebang tells the OS: *"Hey, look up the local Node.js environment, and use it to run the rest of this file."*

### C. Local Testing with `npm link`
While you are developing the tool, you aren't constantly publishing it to NPM to test it. Instead, you run `npm link` in your terminal. This creates a local shortcut on your computer, so you can type `duck` in any folder, and it will run the live code from your project directory.

---

## 3. Parsing Commands (Commander.js)

When a user types something like `duck commit -m "update"` or `duck auth --status`, how do you extract the words "commit" and the message "update"? 

Node provides raw arguments in an array called `process.argv`. But parsing this manually is a nightmare. Instead, we use a library called **Commander.js** (`npm i commander`). 

In Duck CLI, Commander acts as the router. It defines what commands exist, what flags they accept, and what functions they trigger.

```javascript
import { Command } from 'commander';

const program = new Command();

// Define the tool's details
program
  .name('duck')
  .description('Duck AI - Your Git Assistant');

// Define a command
program
  .command('commit')
  .description('Generate an AI commit message')
  .action(() => {
     // This function runs when the user types `duck commit`
     generateCommit(); 
  });

// Parse the arguments the user typed
program.parse(process.argv);
```

---

## 4. Making it Beautiful (UI/UX)

Terminals are normally just boring white/green text on a black background. Duck CLI feels premium because it uses specialized UI libraries to paint the terminal.

*   **`chalk`**: Used to colorize text. Instead of `console.log("Error")`, we use `console.log(chalk.red.bold("Error!"))`.
*   **`boxen`**: Used to draw elegant borders and boxes around text. This is how Duck prints beautiful summary cards and AI responses.
*   **`listr2`**: This is responsible for the animated spinners and task lists. When Duck is "Thinking..." or "Fetching from Groq...", Listr2 is handling those smooth animations.
*   **`figures`**: Provides cross-platform Unicode icons (like ✔, ✖, ℹ, ★).

---

## 5. Making it Interactive (Inquirer.js)

A good CLI doesn't just print text; it asks questions. When Duck asks you *"Do you want to commit this?"* and gives you an arrow-key menu `(Yes / Edit / Cancel)`, we use a library called **Inquirer.js**.

Inquirer pauses the program and takes over the terminal to render an interactive prompt:

```javascript
import inquirer from 'inquirer';

const answer = await inquirer.prompt([
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['Commit automatically', 'Edit message', 'Cancel']
  }
]);

if (answer.action === 'Commit automatically') {
   executeGitCommit();
}
```

---

## 6. Talking to the Operating System (Child Process)

Since Duck CLI is a Git assistant, it needs to be able to run Git commands on the user's computer. To do this, Node.js has a built-in module called `child_process`. 

It allows our JavaScript code to open a hidden shell, type a command (like `git status`), run it, and read the output back into JavaScript.

In Duck CLI, we use a wrapper around child_process called **`simple-git`**. 
When the user types `duck commit`, we use `simple-git` to:
1. Run `git diff` to get the staged changes.
2. Send those changes to an AI (like Groq or Ollama) to generate a message.
3. Run `git commit -m "message"` automatically for the user.

---

## 7. The Architecture of Duck CLI

To understand exactly how Duck CLI works under the hood, here is the flow of data:

1. **The Entry Point:** The user types `duck commit`. The OS sees the Shebang in `bin/duck.js` and boots up Node.js.
2. **The Router:** `bin/duck.js` passes the command to Commander. Commander matches the word `commit` and routes the request to `src/commands/commit.js`.
3. **The Collector:** `commit.js` uses `simple-git` to run a `git diff` and gather the user's code changes.
4. **The Brain:** The diff is passed to the AI Provider module (`src/ai/provider.js`). This module checks if the user is using Groq (Cloud) or Ollama (Local), sends the prompt, and awaits the AI's response.
5. **The UI:** While waiting, `listr2` shows a beautiful spinner. Once the AI responds, `chalk` and `boxen` print the suggested commit message gorgeously in the terminal.
6. **The Interaction:** `inquirer` asks the user to confirm the commit. 
7. **The Execution:** If approved, `simple-git` runs the actual `git commit` command.

---

## Summary (TL;DR for Interviews)

If you are asked how you built this, this is your elevator pitch:

> *"I built Duck CLI using Node.js. I used the `bin` field in `package.json` to register the global command. For parsing terminal arguments, I implemented **Commander.js**. To make it interact with the user's local repository, I used **simple-git** which runs shell commands via Node's child process. The interactive menus are built with **Inquirer**, and the visual styling (colors, boxes, spinners) is handled by a combination of **Chalk, Boxen, and Listr2**. The AI logic interfaces with both local Ollama models and cloud Groq APIs via HTTP requests."*
