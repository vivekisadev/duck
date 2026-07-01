import simpleGit from 'simple-git';

export async function getRecentCommits(limit = 50) {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) return [];
  
  try {
    const log = await git.log({ n: limit });
    return log.all.map(commit => commit.message);
  } catch (err) {
    return [];
  }
}

export async function getWeeklyCommits() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) return [];
  
  try {
    const log = await git.log({ '--since': '1.week.ago' });
    return log.all; // Returns full commit objects for the digest
  } catch (err) {
    return [];
  }
}
