import { Command } from 'commander';
import { getDiff } from './git/getDiff.js';
import { commitChanges } from './git/commit.js';
import chalk from 'chalk';

export async function runCli() {
  const program = new Command();

  program
    .name('duck')
    .description('An AI pair programmer that hooks into the git commit workflow.')
    .version('1.0.0');

  const customHelpText = `
🦆 Welcome to Duck CLI — The AI-Powered Developer's Best Friend! 🦆

Duck hooks into your standard git workflow to eliminate chores, answer the "why" behind code changes, and keep your repo sparkling clean.

--- Core Commands ---
🦆 duck commit
   Why: Write excellent, context-rich commit messages instantly without context-switching.
   How: Stage your files (git add) then run \`duck commit\`.

🦆 duck pr
   Why: Don't spend 20 minutes writing a PR description from scratch.
   How: Run \`duck pr\` on your feature branch before opening a Pull Request.

🦆 duck standup
   Why: Never struggle to answer "what did you do yesterday?" at the 9am meeting.
   How: Run \`duck standup\` to summarize your recent commits.

🦆 duck worklog
   Why: Easily remember your week's work for timesheets without guessing.
   How: Run \`duck worklog --range "this week"\`.

--- Code Context ---
🦆 duck blame-explain <file>:<line>
   Why: Understand the intent behind code before you break it.
   How: Run \`duck blame-explain src/utils.js:42\`.

🦆 duck resolve (conflict-explain)
   Why: Merge conflicts are terrifying; Duck reads both branches and explains how to fix it.
   How: Run \`duck resolve\` when you hit a git merge conflict.

🦆 duck stash-explain
   Why: Stop guessing what "WIP on main" actually means.
   How: Run \`duck stash-explain\` to summarize your git stashes.

🦆 duck onboard
   Why: Get new devs up to speed without writing docs manually.
   How: Run \`duck onboard\` in your repository root.

--- Safety & Maintenance ---
🦆 duck preflight
   Why: Never accidentally push a console.log or commented-out code again.
   How: Run \`duck preflight\` before you push.

🦆 duck deps
   Why: Keep your project safe without manually auditing package.json.
   How: Run \`duck deps\`.

🦆 duck clean
   Why: Keep your local git environment tidy by deleting stale/merged branches safely.
   How: Run \`duck clean\`.

🦆 duck timewarp
   Why: Backdate and distribute your commits across a custom timeline (e.g. to fill a GitHub contribution graph).
   How: Run \`duck timewarp --range "2026-06-01:2026-06-25"\`.

Run \`duck <command> --help\` for specific options.
`;

  program.helpInformation = () => customHelpText;

  program
    .command('/help')
    .description('Show Duck help menu')
    .action(() => {
      console.log(customHelpText);
    });

  program
    .command('diff')
    .description('View the staged git diff')
    .action(async () => {
      try {
        const diff = await getDiff();
        if (!diff) {
          console.log(chalk.yellow('The duck waddled through the repo but found no staged changes! 🦆🔍'));
          return;
        }
        console.log(diff);
      } catch (err) {
        console.error(chalk.red(`The duck tripped and fell: ${err.message}`));
      }
    });

  program
    .command('commit')
    .description('Run the duck commit flow')
    .option('--dry-run', 'Draft message but do not commit')
    .option('-q, --quiet', 'Disable animated spinners and use plain text output')
    .action(async (options) => {
      try {
        const diff = await getDiff();
        if (!diff) {
          console.log(chalk.yellow('The duck waddled through the repo but found no staged changes! 🦆🔍'));
          return;
        }

        const { Listr } = await import('listr2');
        const { generateDraftMessage, generateFinalMessage } = await import('./duck/draftMessage.js');
        const { detectAmbiguity } = await import('./duck/detectAmbiguity.js');
        const { askQuestion } = await import('./duck/askQuestion.js');
        const { loadConfig } = await import('./config/loadConfig.js');
        const { getCachedDraft, setCachedDraft } = await import('./cache/diffCache.js');
        const { scanForSecrets } = await import('./security/secretScan.js');
        const boxen = (await import('boxen')).default;
        const inquirer = (await import('inquirer')).default;

        const config = await loadConfig();
        const isQuiet = options.quiet || !process.stdout.isTTY;
        const listrOpts = {
          renderer: isQuiet ? 'verbose' : 'default',
          rendererOptions: { collapse: false, showErrorMessage: true }
        };

        if (config.style === 'auto') {
          const { getRecentCommits } = await import('./git/history.js');
          const { inferStyleFromHistory } = await import('./duck/styleMatcher.js');
          const commits = await getRecentCommits(50);
          if (commits.length > 0) {
            console.log(chalk.blue('The duck is studying your git history to match your style... 🦆📚'));
            config.style = await inferStyleFromHistory(commits, config);
          }
        }

        const secrets = scanForSecrets(diff);
        if (secrets.length > 0) {
          console.log(chalk.red(`\n🚨 The duck spotted something shiny (and dangerous) in your diff! 🚨`));
          console.log(chalk.red(`Detected possible secrets: ${secrets.join(', ')}`));
          const { proceed } = await inquirer.prompt([{
            type: 'confirm',
            name: 'proceed',
            message: 'Are you absolutely sure you want to send this to the AI API?',
            default: false
          }]);
          if (!proceed) {
            console.log(chalk.yellow('The duck safely waddled away. 🦆💨'));
            return;
          }
        }

        let ctx = { diff, draft: '', ambiguity: null, finalMessage: '' };

        const tasks = new Listr([
          {
            title: 'The duck is putting on its thinking cap to draft a commit message... 🦆💭',
            task: async (context, task) => {
              const cached = await getCachedDraft(context.diff);
              if (cached) {
                task.title = 'The duck remembered this diff! Using cached draft... 🦆🧠';
                context.draft = cached;
              } else {
                context.draft = await generateDraftMessage(context.diff, config);
                await setCachedDraft(context.diff, context.draft);
              }
            }
          },
          {
            title: 'Checking if anything is ambiguous... 🦆🤔',
            task: async (context, task) => {
              context.ambiguity = await detectAmbiguity(context.diff, config);
            }
          }
        ], listrOpts);

        await tasks.run(ctx);

        if (options.dryRun) {
          console.log(chalk.green('\n--- 🦆 Here is what the duck drafted ---'));
          console.log(ctx.draft);
          console.log(chalk.green('---------------------------------------\n'));
          return;
        }

        let questionAnswer = null;
        if (ctx.ambiguity && ctx.ambiguity.needsQuestion && ctx.ambiguity.question) {
          questionAnswer = await askQuestion(ctx.ambiguity.question);
          
          const finalizeTask = new Listr([
            {
              title: 'Finalizing message with your answer... 🦆✍️',
              task: async (context) => {
                context.finalMessage = await generateFinalMessage(
                  context.diff,
                  context.draft,
                  context.ambiguity.question,
                  questionAnswer,
                  config
                );
              }
            }
          ], listrOpts);
          
          await finalizeTask.run(ctx);
        } else {
          ctx.finalMessage = ctx.draft;
        }

        console.log('\n' + boxen(ctx.finalMessage, { padding: 1, borderStyle: 'round', borderColor: 'cyan' }) + '\n');

        const { action } = await inquirer.prompt([
          {
            type: 'select',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'Commit this message', value: 'commit' },
              { name: 'Edit message manually', value: 'edit' },
              { name: 'Cancel', value: 'cancel' }
            ]
          }
        ]);

        if (action === 'cancel') {
          console.log(chalk.yellow('Commit aborted. The duck will wait for your next try. 🦆💤'));
          return;
        }

        let messageToCommit = ctx.finalMessage;
        
        if (action === 'edit') {
          const { editedMessage } = await inquirer.prompt([
            {
              type: 'editor',
              name: 'editedMessage',
              message: 'Edit your commit message:',
              default: ctx.finalMessage
            }
          ]);
          messageToCommit = editedMessage.trim();
          if (!messageToCommit) {
             console.log(chalk.yellow('Empty message. Commit aborted. 🦆💤'));
             return;
          }
        }

        console.log(chalk.blue('Committing...'));
        await commitChanges(messageToCommit);
        console.log(chalk.green('Successfully committed! The duck is proud of you. 🦆✨'));

      } catch (err) {
        console.error(chalk.red(`The duck encountered a hurdle: ${err.message}`));
      }
    });

  program
    .command('install-hook')
    .description('Install the duck git hook')
    .action(async () => {
      const { installHook } = await import('./hook/installHook.js');
      await installHook();
    });

  program
    .command('uninstall-hook')
    .description('Uninstall the duck git hook')
    .action(async () => {
      const { uninstallHook } = await import('./hook/installHook.js');
      await uninstallHook();
    });

  program
    .command('init')
    .description('Initialize a .duckrc configuration file interactively')
    .action(async () => {
      const { runInit } = await import('./commands/init.js');
      await runInit();
    });

  program
    .command('digest')
    .description('Summarize the commits from the past week')
    .action(async () => {
      try {
        const { getWeeklyCommits } = await import('./git/history.js');
        const { generateWeeklyDigest } = await import('./duck/digest.js');
        const { loadConfig } = await import('./config/loadConfig.js');
        const chalk = (await import('chalk')).default;
        const { Listr } = await import('listr2');
        const boxen = (await import('boxen')).default;

        const config = await loadConfig();
        const commits = await getWeeklyCommits();
        
        if (commits.length === 0) {
           console.log(chalk.yellow('No commits found in the last 7 days. The duck has been resting! 🦆💤'));
           return;
        }

        let digestOutput = '';
        const tasks = new Listr([{
          title: 'The duck is reading your commits from the past week... 🦆📚',
          task: async () => {
            digestOutput = await generateWeeklyDigest(commits, config);
          }
        }]);

        await tasks.run();
        
        console.log('\n' + boxen(digestOutput, { padding: 1, borderStyle: 'round', borderColor: 'magenta' }) + '\n');
      } catch (err) {
        console.error(chalk.red(`The duck encountered a hurdle: ${err.message}`));
      }
    });

  program
    .command('radar')
    .description('Show a persistent dashboard of repo state')
    .action(async () => {
      const { runRadar } = await import('./commands/radar.js');
      await runRadar();
    });

  program
    .command('sync-check')
    .description('Check if local branch is behind origin and warn')
    .action(async () => {
      const { loadConfig } = await import('./config/loadConfig.js');
      const { runSyncCheck } = await import('./commands/syncCheck.js');
      const config = await loadConfig();
      await runSyncCheck(config);
    });

  program
    .command('force-push')
    .description('Guarded force-push that creates a backup tag first')
    .action(async () => {
      const { runForcePush } = await import('./commands/forcePush.js');
      await runForcePush();
    });

  program
    .command('reset <target>')
    .description('Guarded hard reset that creates a backup tag first')
    .action(async (target) => {
      const { runReset } = await import('./commands/reset.js');
      await runReset(target);
    });

  program
    .command('goto <ref>')
    .description('Safe checkout wrapper that warns about detached HEAD')
    .action(async (ref) => {
      const { runGoto } = await import('./commands/goto.js');
      await runGoto(ref);
    });

  program
    .command('fetch')
    .description('Fetch with a plain-English readout')
    .action(async () => {
      const { runFetch } = await import('./commands/fetch.js');
      await runFetch();
    });

  program
    .command('pull')
    .description('Pull with an upfront explanation of the strategy')
    .action(async () => {
      const { runPull } = await import('./commands/pull.js');
      await runPull();
    });

  program
    .command('stash-explain')
    .description('Explain what is inside your stashes using AI')
    .action(async () => {
      const { runStashExplain } = await import('./commands/stashExplain.js');
      await runStashExplain();
    });

  program
    .command('blame-explain <target>')
    .description('Explain why a line changed (e.g. src/utils.js:42)')
    .action(async (target) => {
      const { runBlameExplain } = await import('./commands/blameExplain.js');
      await runBlameExplain(target);
    });

  program
    .command('resolve')
    .description('Interactive merge conflict resolver')
    .action(async () => {
      const { runResolve } = await import('./commands/conflictExplain.js');
      await runResolve();
    });

  program
    .command('preflight')
    .description('Scan for debug leftovers before pushing')
    .action(async () => {
      const { runPreflight } = await import('./commands/preflight.js');
      await runPreflight();
    });

  program
    .command('ignore-audit')
    .description('Audit tracked files for common secrets and build artifacts')
    .action(async () => {
      const { runIgnoreAudit } = await import('./commands/ignoreAudit.js');
      await runIgnoreAudit();
    });

  program
    .command('history-scan')
    .description('Scan full history for accidentally committed secrets')
    .action(async () => {
      const { runHistoryScan } = await import('./commands/historyScan.js');
      await runHistoryScan();
    });

  program
    .command('clean')
    .description('Clean up stale and merged local branches')
    .action(async () => {
      const { runClean } = await import('./commands/clean.js');
      await runClean();
    });

  program
    .command('deps')
    .description('Check dependencies for updates and vulnerabilities')
    .action(async () => {
      const { runDeps } = await import('./commands/deps.js');
      await runDeps();
    });

  program
    .command('standup')
    .description('Generate a standup summary of yesterday\'s commits')
    .action(async () => {
      const { runStandup } = await import('./commands/standup.js');
      await runStandup();
    });

  program
    .command('worklog')
    .description('Generate a day-by-day worklog (e.g. for timesheets)')
    .option('--range <range>', 'Time range (e.g. "this week")', '1 week')
    .action(async (options) => {
      const { runWorklog } = await import('./commands/worklog.js');
      await runWorklog(options.range);
    });

  program
    .command('pr')
    .description('Draft a full PR description based on branch commits')
    .action(async () => {
      const { runPr } = await import('./commands/pr.js');
      await runPr();
    });

  program
    .command('changelog')
    .description('Draft release notes between two tags')
    .option('--from <tag>', 'Starting tag')
    .option('--to <tag>', 'Ending tag')
    .action(async (options) => {
      const { runChangelog } = await import('./commands/changelog.js');
      await runChangelog(options.from, options.to);
    });

  program
    .command('onboard')
    .description('Generate ONBOARDING.md based on repo history and structure')
    .action(async () => {
      const { runOnboard } = await import('./commands/onboard.js');
      await runOnboard();
    });

  program
    .command('timewarp')
    .alias('backdate')
    .description('Backdate and distribute staged changes across a timeline')
    .option('--range <range>', 'Date or date range (e.g., 2026-06-01:2026-06-25)')
    .option('--date <date>', 'Single date to commit all staged changes')
    .option('--commits <count>', 'Number of commits to split into', parseInt, 1)
    .option('--distribution <mode>', 'even, random, or weighted-recent', 'even')
    .action(async (options) => {
      try {
        const { executeTimewarp } = await import('./duck/timewarp.js');
        
        const range = options.range || options.date;
        if (!range) {
          console.error('Please provide --range or --date');
          return;
        }
        
        await executeTimewarp(range, options.commits, options.distribution);
      } catch (err) {
        const chalk = (await import('chalk')).default;
        console.error(chalk.red(`The duck encountered a hurdle during timewarp: ${err.message}`));
      }
    });

  program
    .command('commit-hook <msgFile>')
    .description('Internal command used by the git hook')
    .action(async (msgFile) => {
      try {
        const diff = await getDiff();
        if (!diff) {
          return; // Let standard git handle no changes
        }

        const { Listr } = await import('listr2');
        const { generateDraftMessage, generateFinalMessage } = await import('./duck/draftMessage.js');
        const { detectAmbiguity } = await import('./duck/detectAmbiguity.js');
        const { askQuestion } = await import('./duck/askQuestion.js');
        const { loadConfig } = await import('./config/loadConfig.js');
        const { getCachedDraft, setCachedDraft } = await import('./cache/diffCache.js');
        const { scanForSecrets } = await import('./security/secretScan.js');
        const boxen = (await import('boxen')).default;
        const inquirer = (await import('inquirer')).default;
        const fs = await import('fs/promises');

        const config = await loadConfig();
        const isQuiet = !process.stdout.isTTY;
        const listrOpts = {
          renderer: isQuiet ? 'verbose' : 'default',
          rendererOptions: { collapse: false, showErrorMessage: true }
        };

        if (config.style === 'auto') {
          const { getRecentCommits } = await import('./git/history.js');
          const { inferStyleFromHistory } = await import('./duck/styleMatcher.js');
          const commits = await getRecentCommits(50);
          if (commits.length > 0) {
            console.log(chalk.blue('The duck is studying your git history to match your style... 🦆📚'));
            config.style = await inferStyleFromHistory(commits, config);
          }
        }

        const secrets = scanForSecrets(diff);
        if (secrets.length > 0) {
          console.log(chalk.red(`\n🚨 The duck spotted something shiny (and dangerous) in your diff! 🚨`));
          console.log(chalk.red(`Detected possible secrets: ${secrets.join(', ')}`));
          const { proceed } = await inquirer.prompt([{
            type: 'confirm',
            name: 'proceed',
            message: 'Are you absolutely sure you want to send this to the AI API?',
            default: false
          }]);
          if (!proceed) {
            console.log(chalk.yellow('The duck safely waddled away. 🦆💨'));
            process.exit(1);
          }
        }

        let ctx = { diff, draft: '', ambiguity: null, finalMessage: '' };

        const tasks = new Listr([
          {
            title: 'The duck is putting on its thinking cap to draft a commit message... 🦆💭',
            task: async (context, task) => {
              const cached = await getCachedDraft(context.diff);
              if (cached) {
                task.title = 'The duck remembered this diff! Using cached draft... 🦆🧠';
                context.draft = cached;
              } else {
                context.draft = await generateDraftMessage(context.diff, config);
                await setCachedDraft(context.diff, context.draft);
              }
            }
          },
          {
            title: 'Checking if anything is ambiguous... 🦆🤔',
            task: async (context, task) => {
              context.ambiguity = await detectAmbiguity(context.diff, config);
            }
          }
        ], listrOpts);

        await tasks.run(ctx);

        let questionAnswer = null;
        if (ctx.ambiguity && ctx.ambiguity.needsQuestion && ctx.ambiguity.question) {
          questionAnswer = await askQuestion(ctx.ambiguity.question);
          
          const finalizeTask = new Listr([
            {
              title: 'Finalizing message with your answer... 🦆✍️',
              task: async (context) => {
                context.finalMessage = await generateFinalMessage(
                  context.diff,
                  context.draft,
                  context.ambiguity.question,
                  questionAnswer,
                  config
                );
              }
            }
          ], listrOpts);
          
          await finalizeTask.run(ctx);
        } else {
          ctx.finalMessage = ctx.draft;
        }

        console.log('\n' + boxen(ctx.finalMessage, { padding: 1, borderStyle: 'round', borderColor: 'cyan' }) + '\n');

        const { action } = await inquirer.prompt([
          {
            type: 'select',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              { name: 'Use this message', value: 'commit' },
              { name: 'Edit message manually', value: 'edit' },
              { name: 'Cancel commit', value: 'cancel' }
            ]
          }
        ]);

        if (action === 'cancel') {
          console.log(chalk.yellow('Commit aborted. 🦆💤'));
          process.exit(1);
        }

        let messageToCommit = ctx.finalMessage;
        
        if (action === 'edit') {
          const { editedMessage } = await inquirer.prompt([
            {
              type: 'editor',
              name: 'editedMessage',
              message: 'Edit your commit message:',
              default: ctx.finalMessage
            }
          ]);
          messageToCommit = editedMessage.trim();
          if (!messageToCommit) {
             console.log(chalk.yellow('Empty message. Commit aborted. 🦆💤'));
             process.exit(1);
          }
        }

        // Write the message to the git commit message file
        await fs.writeFile(msgFile, messageToCommit);
        console.log(chalk.green('Message ready! The duck approves. 🦆✨'));

      } catch (err) {
        console.error(chalk.red(`The duck encountered a hurdle: ${err.message}`));
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}
