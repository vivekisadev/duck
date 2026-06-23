# Duck CLI - Full Documentation

Duck is designed to fix the gaps in Git's user experience. It adds state awareness, destructive action guards, and AI-powered explanations. Below is the full suite of commands and a preview of how they work in your terminal.

---

## Configuration & API Keys

Duck is a local CLI tool that uses AI to analyze your code. It needs an AI provider to function.

### Setting up Groq (Recommended, Free, and Fast)
1. Go to the [Groq Console](https://console.groq.com) and create a free account.
2. Generate an API Key.
3. Save this key as an environment variable:
   - **Mac/Linux**: `export DUCK_GROQ_API_KEY="your-api-key"`
   - **Windows**: `setx DUCK_GROQ_API_KEY "your-api-key"`

### Setting up Ollama (Fully Offline, Local)
If you don't want to use external APIs, you can use [Ollama](https://ollama.com) to run models directly on your machine.
1. Download and install Ollama.
2. Pull a small instruction-tuned model in your terminal (e.g., `ollama run llama3.2`).
3. Configure Duck to use Ollama by creating a `.duckrc` file (see below).

### The `.duckrc` Configuration File
You can customize Duck by creating a `.duckrc` or `duck.config.json` file in your repository or home directory.

```json
{
  "provider": "groq",
  "model": "llama-3.3-70b-versatile",
  "style": "conventional-commits",
  "duckPersonality": "neutral"
}
```

- **`provider`**: Set to `"groq"` (default) or `"ollama"`.
- **`model`**: The specific model you want to use.
- **`style`**: `"conventional-commits"`, `"gitmoji"`, `"plain"`, or a custom style string.
- **`duckPersonality`**: `"neutral"`, `"strict-senior-dev"`, `"sarcastic"`, or `"encouraging"`.

---

## 1. Core Workflow & AI Assistance

### `duck commit`
Reads your staged changes, scans for secrets, drafts a commit message, and asks clarifying questions if your code changes are ambiguous.

```
$ duck commit
✓ Reading staged diff
✓ Scanning for secrets
✓ Drafting commit message
✓ Checking for ambiguity
🦆 Quick one: this removes a null check — handled elsewhere now, or dropped?
> handled upstream in validateInput()
✓ Finalizing message

┌─────────────────────────────────────────────────────────┐
│ fix(auth): remove redundant null check, now validated   │
│ upstream in validateInput()                              │
└─────────────────────────────────────────────────────────┘

Commit? [Y/n/e] y
```

### `duck diff`
Quickly view your staged changes.

### `duck install-hook` / `duck uninstall-hook`
Installs (or uninstalls) Duck directly into your `git commit` workflow using a `prepare-commit-msg` hook.

---

## 2. State Awareness

### `duck radar`
A persistent dashboard showing your branch, detached HEAD status, ahead/behind counts, staged/unstaged files, and stash count.

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

### `duck sync-check`
Compares your local branch against `origin` and warns you if you are significantly behind.

```
$ duck sync-check
✓ Comparing local branch against origin/main

⚠ Your branch is 23 commits behind origin/main
  (last synced 4 days ago)

  Recommend pulling before continuing — the longer this
  gap grows, the harder the eventual merge/rebase gets.

Pull now? [Y/n]
```

---

## 3. Destructive Action Guards

### `duck goto <ref>`
A safe wrapper around `git checkout`. Warns you if you are entering detached HEAD and offers to create a branch first.

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

### `duck force-push`
A guarded `git push --force`. Automatically creates a lightweight recovery tag before overwriting remote history.

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

### `duck reset <target>`
A guarded `git reset --hard`. Creates a recovery tag before discarding local commits.

```
$ duck reset --hard HEAD~3
⚠ This will discard 3 local commits and all uncommitted changes.
  A recovery tag will be created: backup/before-reset-2026-07-15
  (recover anytime with: git reset --hard backup/before-reset-2026-07-15)

Proceed? [y/N]
```

---

## 4. Explain & Resolve

### `duck fetch` & `duck pull`
`duck fetch` provides a plain-English readout of incoming commits. `duck pull` explains the merge strategy it is about to use.

```
$ duck fetch
✓ Fetching from origin (no local changes made)

  origin/main has 5 new commits you don't have yet
  Your branch has 2 commits origin doesn't have

  Nothing on your machine changed — this was read-only.
  Run `duck pull` when you're ready to bring those in.
```

### `duck stash-explain`
Reads the actual diffs inside your git stashes and explains what is in them, replacing "WIP on main".

```
$ duck stash-explain
✓ Reading stash diffs

stash@{0}: Half-finished dark mode toggle in Settings.jsx
            (CSS variables added, JS logic not wired up yet)
stash@{1}: Debugging attempt for the CSV export bug —
            added console.logs, no fix yet
```

### `duck blame-explain <file>:<line>`
Runs `git blame` and uses AI to read the context of the original commit message.

```
$ duck blame-explain src/utils/validate.js:42
✓ Reading commit history for this line
✓ Reading the original commit message and diff context

Line 42 was last changed in commit 7f3a9c1
"fix(validate): loosen email regex to allow + aliases"

Context: the original regex rejected valid emails like
alice+newsletter@gmail.com — this was a bug fix, not a
simplification. Changing it back would reintroduce that bug.
```

### `duck conflict-explain <file>` & `duck resolve`
Walks you through merge conflicts file by file, using AI to explain *why* the two branches diverged.

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
```

---

## 5. Security & Hygiene

### `duck preflight`
Scans for `console.log`, large commented-out blocks, and unresolved TODOs.

```
$ duck preflight
✓ Scanning staged + unstaged changes

┌─ Preflight Warnings ────────────────────────────────────┐
│ ⚠ src/api/users.js:42 — console.log left in             │
│ ⚠ src/utils/csv.js:88 — commented-out block (12 lines)  │
│ ⚠ src/hooks/useAuth.js:15 — "TODO: handle expired token" │
│   looks unresolved and this touches the auth flow         │
└──────────────────────────────────────────────────────────┘

Push anyway? [y/N]
```

### `duck ignore-audit`
Checks your tracked files against common ignore patterns.

```
$ duck ignore-audit
✓ Checking tracked files against common ignore patterns

⚠ These look like they shouldn't be tracked:
    node_modules/          (2,341 files)
    .env                    (contains what looks like an API key)
    dist/build.min.js       (generated build artifact)

  Add these to .gitignore and untrack them now? [Y/n]
```

### `duck history-scan`
Scans your entire commit history for accidentally committed secrets.

```
$ duck history-scan
✓ Scanning full commit history for accidentally committed secrets

⚠ Found what looks like an AWS key in commit 7f3a9c1
  (3 commits ago, in src/config/aws.js)

  This is now in your history permanently unless rewritten.
  Recommended: rotate this key immediately (assume it's
  compromised), then use `duck force-push` after cleaning
  history with git-filter-repo.
```

### `duck clean`
Scans local and remote branches to categorize them as safely deletable or "needs a look".

```
$ duck clean
✓ Scanning local and remote branches
✓ Checking merge status against main

┌─ Branch Report ─────────────────────────────────────────┐
│ Safe to delete (merged, no unique commits):              │
│   ✓ feature/old-login-page      (merged 3 months ago)   │
│   ✓ fix/typo-readme              (merged 1 month ago)    │
│                                                           │
│ Needs a look (unmerged, but stale):                      │
│   ⚠ feature/dark-mode           (last commit 6 weeks ago)│
└──────────────────────────────────────────────────────────┘

Delete the 2 safe branches? [Y/n]
```

### `duck deps`
Checks installed packages against the latest versions and cross-references known security advisories.

```
$ duck deps
✓ Checking installed packages against latest versions
✓ Cross-referencing known security advisories

┌─ Dependency Report ──────────────────────────────────────┐
│ ⚠ lodash 4.17.15 → 4.17.21 (fixes a known prototype       │
│    pollution vulnerability — recommend updating soon)      │
│ ℹ react 18.2.0 → 19.0.0 (major version — has breaking     │
│    changes, review before updating)                        │
│ ✓ express, axios, dotenv — up to date                      │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Summarization & Reporting

### `duck standup`
Reads your commits since yesterday and groups them by theme.

```
$ duck standup
✓ Reading commits since yesterday 9:00 AM
✓ Grouping by theme

┌─ Yesterday ────────────────────────────────────────────┐
│ • Fixed a race condition in the auth token refresh flow │
│ • Refactored the user validation logic into a shared    │
│   helper (was duplicated in 3 places)                    │
│ • Started the CSV export feature — schema done, UI      │
│   still pending                                          │
└───────────────────────────────────────────────────────┘

Copy to clipboard? [Y/n] y
```

### `duck worklog --range "this week"`
Groups commits by day for a longer range (perfect for timesheets or invoicing).

```
$ duck worklog --range "this week"
✓ Reading commits from Mon–Fri
✓ Grouping by day

┌─ Week of Jul 7–11 ───────────────────────────────────────┐
│ Mon: Auth token refresh fix, code review feedback         │
│ Tue: CSV export — schema + backend endpoint               │
│ Wed: CSV export — frontend UI                             │
│ Thu: Bug fixes from QA pass                                │
│ Fri: PR reviews, dependency updates                        │
└──────────────────────────────────────────────────────────┘

Export as PDF for invoicing? [Y/n]
```

### `duck pr`
Drafts a full Pull Request description based on branch commits.

```
$ duck pr
✓ Comparing feature/csv-export against main
✓ Reading 14 commits
✓ Drafting description

┌─ Pull Request Draft ──────────────────────────────────┐
│ ## What                                                 │
│ Adds CSV export for the reports page                    │
│                                                          │
│ ## Why                                                  │
│ Users have been manually screenshotting tables — this   │
│ was the #2 requested feature in last month's survey     │
│ ...                                                     │
└────────────────────────────────────────────────────────┘

Open in browser to create PR with this description? [Y/n]
```

### `duck changelog --from <tag> --to <tag>`
Drafts release notes.

```
$ duck changelog --from v1.2.0 --to v1.3.0
✓ Reading 41 commits between tags
✓ Grouping by type

┌─ v1.3.0 Release Notes ──────────────────────────────────┐
│ ### Features                                             │
│ - CSV export for reports (#212)                          │
│ - Dark mode toggle (#198)                                 │
│                                                            │
│ ### Fixes                                                 │
│ - Auth token refresh race condition (#221)                │
└────────────────────────────────────────────────────────┘

Save to CHANGELOG.md? [Y/n]
```

### `duck onboard`
Generates a living `ONBOARDING.md` document for new contributors.

```
$ duck onboard
✓ Reading project structure
✓ Reading recent commit patterns and code conventions

✓ Generated ONBOARDING.md:
  - Project structure overview
  - Where the "real" logic lives vs. boilerplate
  - Commit message conventions this repo actually follows
  - Common gotchas found in recent bug-fix commits
```

### `duck digest`
A quick summary of the past 7 days of commits.

---

## 7. Advanced

### `duck timewarp`
Backdate and distribute staged changes across a timeline with randomized hours to reflect when you actually did the work.

```
duck timewarp --range 2026-06-01:2026-06-25 --commits 14 --distribution even
```
