# duck — Solving Git's Biggest Everyday Frustrations

The common thread across almost every well-known Git complaint isn't that Git is powerful — it's that Git gives you **zero visual state awareness** and lets you run **destructive commands with no safety net**. Below, each major pain point is mapped to a specific duck command designed to fix exactly that gap — not by hiding Git's power, but by putting a checkpoint between the developer and the moment things usually go wrong.

---

## Root Cause: No Persistent State Awareness

Before the individual pain points, one command underlies all of them:

### `duck radar` — always-on state dashboard

**The hassle it solves:** Git never tells you your full situation at a glance — branch, detached HEAD, ahead/behind counts, stash count, uncommitted changes — you have to run 4–5 separate commands to piece it together, and most developers just don't.

```
$ duck radar
┌─ Repo State ─────────────────────────────────────────────┐
│ Branch:       feature/csv-export                          │
│ HEAD:         attached ✓                                  │
│ Remote:       2 ahead, 5 behind origin/feature/csv-export  │
│ Staged:       3 files                                      │
│ Unstaged:     1 file                                        │
│ Stashes:      2 pending                                     │
│ Last synced:  3 days ago ⚠                                  │
└──────────────────────────────────────────────────────────┘
```

**Why it's good:** This is the single dashboard that makes every other command below unnecessary to think about proactively — duck can run this check silently before any risky command and warn you in context, instead of you having to remember to check it yourself.

---

## 1. The Detached HEAD Trap

**The real problem:** Checking out a commit/tag directly (instead of a branch) silently puts you in detached HEAD. If you commit here and switch branches later, those commits can become unreachable and effectively lost — and Git gives no warning when you enter this state.

### `duck goto <ref>` — safe checkout wrapper

```
$ duck goto v1.2.0
⚠ This commit isn't a branch — checking it out directly will
  put you in "detached HEAD." Any commits you make here won't
  belong to a branch and can be lost when you switch away.

  What do you want to do?
  › Just look around (read-only, I won't commit here)
    Create a branch here first (safe to commit)
    Cancel
```

If the developer picks "just look around" but then actually runs `git commit` while detached, duck's existing pre-commit hook (from the core flow) adds one more check:

```
$ git commit -m "quick fix"
⚠ You're in detached HEAD from your earlier `duck goto v1.2.0`.
  This commit will NOT be on any branch — it can be lost.
  Create a branch to save it as feature/hotfix-v1.2.0? [Y/n]
```

**Why it's good:** It turns a silent, invisible state into an explicit choice made *before* the risky part happens, and catches the recovery moment too if the developer forgets and commits anyway — nothing is lost, because duck already knows it's watching a detached state.

---

## 2. Destructive History Rewriting (force-push, hard reset)

**The real problem:** `git push --force` and `git reset --hard` can permanently wipe commits — teammates' work, your own uncommitted progress, or an entire branch — with no built-in undo.

### `duck force-push` — guarded force-push

```
$ duck force-push
✓ Checking what would be overwritten on origin/feature/export

⚠ This will discard 3 commits currently on the remote branch
  that aren't in your local history:
    - a1b2c3d "wip: trying different csv delimiter"
    - 9f8e7d6 "fix typo"
    - 3c2b1a0 "add loading spinner"

  These were pushed by: (teammate, 2 hours ago)

  A safety tag will be created first: backup/export-2026-07-15
  so this can be recovered if needed.

Proceed with force-push? [y/N]
```

### `duck reset <target>` — guarded reset

```
$ duck reset --hard HEAD~3
⚠ This will discard 3 local commits and all uncommitted changes.
  A recovery tag will be created: backup/before-reset-2026-07-15
  (recover anytime with: git reset --hard backup/before-reset-2026-07-15)

Proceed? [y/N]
```

**Why it's good:** Both commands auto-create a lightweight recovery tag *before* running the destructive operation — so "undo" always exists, and the developer sees exactly what's about to be lost (including whose commits, for force-push) instead of finding out after the fact.

---

## 3. Fetch vs. Pull Confusion

**The real problem:** `git fetch` updates your knowledge of the remote silently — no working directory changes — while `git pull` fetches *and* merges/rebases immediately. Developers often can't tell which state they're actually in, or what `pull` is about to do to their local commits before it happens.

### `duck fetch` — fetch with a plain-English readout

```
$ duck fetch
✓ Fetching from origin (no local changes made)

  origin/main has 5 new commits you don't have yet
  Your branch has 2 commits origin doesn't have

  Nothing on your machine changed — this was read-only.
  Run `duck pull` when you're ready to bring those in.
```

### `duck pull` — pull with an upfront explanation

```
$ duck pull
✓ This will merge 5 incoming commits into your branch
  (using merge, not rebase — per your .duckrc setting)

  No conflicts expected based on file overlap check.

Proceed? [Y/n]
```

**Why it's good:** `fetch` explicitly states it changed nothing, and `pull` explicitly states *which strategy* it'll use and what to expect *before* running — removing the two most common sources of "wait, what just happened to my branch."

---

## 4. Overwhelming Merge Conflicts

**The real problem:** A conflict across many files dumps all of them on you at once, each full of raw `<<<<<<<` / `=======` / `>>>>>>>` markers, with no explanation of *why* the two sides diverged — just the fact that they did.

### `duck resolve` — one conflict at a time, explained

Builds directly on `duck conflict-explain` (already speced), but walks the whole conflict set interactively instead of dumping everything at once:

```
$ duck resolve
✓ Found 4 conflicting files — walking through them one at a time

[1/4] src/utils/format.js
  Your side changed this to handle null values safely.
  Their side changed the same function for a new date format.
  These changes are unrelated — safe to keep both.

  › Keep both (duck will merge them)
    Show me the raw diff instead
    Skip for now

✓ Resolved 1/4 — 3 remaining
[2/4] src/api/users.js
  ...
```

**Why it's good:** Instead of one intimidating wall of conflict markers across every file, the developer resolves one clearly-explained decision at a time — the same conflict set, but broken into digestible, sequential choices.

---

## 5. Committing the Wrong Things (secrets, build folders, huge files)

**The real problem:** A missing or incomplete `.gitignore` means `node_modules/`, `.env` files, or build artifacts get tracked before anyone notices — sometimes not until they're already pushed and visible to the whole team (or the whole internet, if the repo is public).

### `duck ignore-audit` — catches this before the first bad commit

```
$ duck ignore-audit
✓ Checking tracked files against common ignore patterns

⚠ These look like they shouldn't be tracked:
    node_modules/          (2,341 files)
    .env                    (contains what looks like an API key)
    dist/build.min.js       (generated build artifact)

  Add these to .gitignore and untrack them now? [Y/n]
```

### `duck history-scan` — catches it if it *already* happened

```
$ duck history-scan
✓ Scanning full commit history for accidentally committed secrets

⚠ Found what looks like an AWS key in commit 7f3a9c1
  (3 commits ago, in src/config/aws.js)

  This is now in your history permanently unless rewritten.
  Recommended: rotate this key immediately (assume it's
  compromised), then use `duck force-push` after cleaning
  history with git-filter-repo — duck can walk you through
  that safely, including the backup tag from Section 2.
```

**Why it's good:** `ignore-audit` catches the mistake *before* it's committed at all — the cheapest possible moment to fix it. `history-scan` catches it *after*, and explicitly treats "rotate the key" as the real first step (since removing it from git history doesn't undo exposure if it was ever pushed) rather than jumping straight to a risky history rewrite.

---

## How These Connect to Everything Already Speced

- `duck force-push` and `duck reset` reuse the same confirm-before-destructive-action pattern already established for `duck clean` and `duck timewarp`.
- `duck resolve` is `duck conflict-explain` (Section 10.11 of the build guide) with an interactive walk-through wrapper — not a separate AI integration.
- `duck ignore-audit` and `duck history-scan` extend the existing `secretScan.js` module (already in the core architecture) to run proactively and retroactively, not just on the current staged diff.
- `duck radar` is the dashboard version of the state-checks these commands already need internally — building it first actually makes the others easier to implement, since they can all call into it rather than each re-deriving repo state.

**Build order recommendation:** `duck radar` first (everything else leans on it), then the detached-HEAD guard and force-push/reset guards (highest safety value), then `duck resolve`, then the ignore-audit/history-scan pair.
