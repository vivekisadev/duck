import simpleGit from 'simple-git';

export async function commitChanges(message) {
  const git = simpleGit();
  await git.commit(message);
}
