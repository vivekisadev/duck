const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
}

console.log("Adding all files to get master list...");
try {
  run('git add .');
} catch (e) {
  console.log("Warning during git add: " + e.message);
}

const allFiles = run('git diff --name-only --cached').split('\n').filter(Boolean);
console.log(`Found ${allFiles.length} files to commit.`);

const endDate = new Date();
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);

const days = [];
for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
  const numCommits = isWeekend ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < numCommits; i++) {
    const commitDate = new Date(d);
    commitDate.setHours(9 + Math.floor(Math.random() * 9), Math.floor(Math.random() * 60));
    days.push(commitDate);
  }
}

days.sort((a, b) => a - b);
console.log(`Generated ${days.length} commit slots based on weekend/weekday distribution.`);

run('git reset');

if (allFiles.length === 0) {
    console.log("No files to commit.");
    process.exit(0);
}

const filesPerCommit = Math.max(1, Math.ceil(allFiles.length / days.length));

const prefixes = ["feat", "fix", "chore", "style", "refactor", "docs", "test"];
const actions = ["add", "update", "refactor", "fix", "implement", "improve"];
const targets = ["components", "utils", "config", "ui", "logic", "tests", "docs", "backend"];

for (let i = 0; i < days.length; i++) {
  const chunk = allFiles.slice(i * filesPerCommit, (i + 1) * filesPerCommit);
  if (chunk.length === 0) break;

  const dateStr = days[i].toISOString();
  fs.writeFileSync('files.txt', chunk.join('\n'));
  
  run('git add --pathspec-from-file=files.txt');
  
  const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
  const act = actions[Math.floor(Math.random() * actions.length)];
  const tgt = targets[Math.floor(Math.random() * targets.length)];
  const msg = `${pref}: ${act} ${tgt} (part ${i+1})`;
  
  execSync(`git commit -m "${msg}"`, {
    env: {
      ...process.env,
      GIT_AUTHOR_DATE: dateStr,
      GIT_COMMITTER_DATE: dateStr
    },
    stdio: 'ignore'
  });
  console.log(`Committed chunk ${i+1} at ${dateStr} with ${chunk.length} files.`);
}
if (fs.existsSync('files.txt')) fs.unlinkSync('files.txt');
console.log("Backdate distribution complete.");
