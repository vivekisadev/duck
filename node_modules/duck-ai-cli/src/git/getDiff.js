import simpleGit from 'simple-git';

export async function getDiff() {
  const git = simpleGit();
  
  // Get staged diff
  const diff = await git.diff(['--staged']);
  
  return diff.trim();
}
