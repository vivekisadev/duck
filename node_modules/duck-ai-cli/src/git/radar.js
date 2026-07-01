import simpleGit from 'simple-git';

export async function getRepoState() {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  
  if (!isRepo) {
    return { isRepo: false };
  }

  const status = await git.status();
  const branches = await git.branchLocal();
  const stashes = await git.stashList();
  
  // Detached HEAD check
  const isDetached = branches.current === '';
  const currentBranch = isDetached ? (await git.revparse(['--short', 'HEAD'])).trim() : branches.current;

  // Stash count
  const stashCount = stashes.all.length;

  // Ahead/Behind count (if remote tracking exists)
  let ahead = status.ahead;
  let behind = status.behind;
  let tracking = status.tracking;

  // Last synced check
  let lastSynced = null;
  if (tracking) {
    try {
      // Find the committer date of the latest commit on the remote tracking branch
      const reflog = await git.raw(['log', '-1', '--format=%cr', tracking]);
      lastSynced = reflog.trim();
    } catch (err) {
       lastSynced = 'unknown';
    }
  }

  return {
    isRepo: true,
    branch: currentBranch,
    isDetached,
    ahead,
    behind,
    tracking,
    staged: status.staged.length,
    unstaged: status.files.length - status.staged.length,
    stashCount,
    lastSynced
  };
}
