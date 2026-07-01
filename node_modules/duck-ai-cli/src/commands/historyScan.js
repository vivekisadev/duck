import simpleGit from 'simple-git';
import chalk from 'chalk';
import ora from 'ora';

// Reuse the regex patterns from secretScan
const SECRET_PATTERNS = [
  /(?:api_key|apikey|secret|token|password)[\s=:]+["'][a-zA-Z0-9_\-\.]{10,}["']/i,
  /AKIA[0-9A-Z]{16}/, // AWS Access Key ID
  /sk_[live|test]_[0-9a-zA-Z]{24}/, // Stripe Secret Key
  /github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}/ // GitHub PAT
];

export async function runHistoryScan() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    console.log(chalk.red('Not a git repository.'));
    return;
  }

  const spinner = ora('Scanning full commit history for accidentally committed secrets...').start();

  try {
    // Get all commits
    const log = await git.log();
    const commits = log.all;
    
    let findings = [];

    // For a real production app, scanning full history diffs might be slow.
    // We'll scan a reasonable chunk for this demo MVP (e.g. last 100 commits).
    const commitsToScan = commits.slice(0, 100);

    for (let i = 0; i < commitsToScan.length; i++) {
      const commit = commitsToScan[i];
      // Get diff of this commit vs its parent
      const diff = await git.raw(['show', commit.hash]);

      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(diff)) {
          findings.push({
            hash: commit.hash.substring(0, 7),
            message: commit.message,
            ago: i // commits ago
          });
          break; // move to next commit if found
        }
      }
    }

    spinner.stop();

    if (findings.length > 0) {
       console.log(chalk.red(`\n⚠ Found potential secrets in history:\n`));
       
       findings.forEach(f => {
          console.log(chalk.yellow(`  In commit ${f.hash} (${f.ago} commits ago)`));
          console.log(chalk.gray(`  "${f.message}"\n`));
       });

       console.log(chalk.red(`  These are now in your history permanently unless rewritten.`));
       console.log(chalk.red(`  Recommended: rotate these keys immediately (assume they are`));
       console.log(chalk.red(`  compromised), then use \`duck force-push\` after cleaning`));
       console.log(chalk.red(`  history with git-filter-repo.\n`));
    } else {
       console.log(chalk.green('✓ No obvious secrets found in recent history.'));
    }

  } catch (err) {
    spinner.stop();
    console.log(chalk.red(`Scan failed: ${err.message}`));
  }
}
