import { exec } from 'child_process';
import util from 'util';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';

const execAsync = util.promisify(exec);

export async function runDeps() {
  const spinner = ora('Checking installed packages against latest versions...').start();
  
  let outdated = {};
  try {
    // npm outdated returns non-zero exit code if updates are found
    const { stdout } = await execAsync('npm outdated --json');
    if (stdout) outdated = JSON.parse(stdout);
  } catch (err) {
    if (err.stdout) outdated = JSON.parse(err.stdout);
  }

  spinner.text = 'Cross-referencing known security advisories...';
  
  let audit = {};
  try {
    const { stdout } = await execAsync('npm audit --json');
    if (stdout) audit = JSON.parse(stdout);
  } catch (err) {
    if (err.stdout) audit = JSON.parse(err.stdout);
  }

  spinner.stop();
  console.log(chalk.cyan('✓ Checking installed packages against latest versions'));
  console.log(chalk.cyan('✓ Cross-referencing known security advisories\n'));

  const lines = [];

  const vulnerabilities = audit.vulnerabilities || {};
  
  const packages = Object.keys(outdated);
  
  if (packages.length === 0 && Object.keys(vulnerabilities).length === 0) {
     lines.push(chalk.green('✓ All dependencies are up to date and secure.'));
  } else {
     for (const pkg of packages) {
       const info = outdated[pkg];
       const current = info.current || 'unknown';
       const latest = info.latest || 'unknown';
       
       let isMajor = false;
       if (current !== 'unknown' && latest !== 'unknown') {
         const currentMajor = current.split('.')[0];
         const latestMajor = latest.split('.')[0];
         if (currentMajor !== latestMajor) isMajor = true;
       }

       const vuln = vulnerabilities[pkg];

       if (vuln) {
         lines.push(`  ${chalk.red('⚠')} ${pkg} ${current} → ${latest}`);
         lines.push(`    ${chalk.red(`(Security advisory: ${vuln.severity} — recommend updating soon)`)}`);
       } else if (isMajor) {
         lines.push(`  ${chalk.yellow('ℹ')} ${pkg} ${current} → ${latest}`);
         lines.push(`    ${chalk.yellow(`(major version — has breaking changes, review before updating)`)}`);
       } else {
         lines.push(`  ${chalk.cyan('↑')} ${pkg} ${current} → ${latest} (minor/patch)`);
       }
     }

     const otherVulns = Object.keys(vulnerabilities).filter(p => !packages.includes(p));
     for (const pkg of otherVulns) {
        const vuln = vulnerabilities[pkg];
        lines.push(`  ${chalk.red('⚠')} ${pkg} (Current version has a ${vuln.severity} vulnerability)`);
     }
  }

  console.log(boxen(lines.join('\n'), {
    title: '🦆 Dependency Report',
    padding: 1,
    borderStyle: 'round',
    borderColor: 'magenta'
  }) + '\n');
}
