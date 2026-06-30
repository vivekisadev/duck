# duck — Full Command Reference

Every command below follows the same philosophy as the core `duck commit`: attach to a hassle that already exists in a developer's day, do the boring part automatically, and only ask a human when the automation genuinely can't guess the answer. Terminal outputs shown are illustrative — exact formatting will follow the CLI visual spec (spinners → checkmarks → boxed results) from the build guide.

---

## 1. `duck commit`
*(the core command — covered in full in the build guide)*

**The hassle it solves:** Commit messages are either rushed ("fix stuff") or a whole context-switch to write properly. Neither produces a history anyone can actually use later.

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
[main a1b2c3d] fix(auth): remove redundant null check...
```

**Why it's good:** The message reflects *why*, not just *what* — because the one question that matters got asked at the one moment it was answerable (right now, not six months later trying to remember).

---

## 2. `duck standup`

**The hassle it solves:** The 9am scramble to remember what you actually did yesterday, especially after a day of context-switching between three different things.

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

**Why it's good:** It's built from what you *actually committed*, not what you remember doing — which is usually more accurate and takes zero effort to produce.

---

## 3. `duck pr`

**The hassle it solves:** PR descriptions are an afterthought, so reviewers end up reverse-engineering "what is this PR even trying to do" from a 40-file diff.

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
│                                                          │
│ ## Testing                                              │
│ - Verified export with 10k+ row datasets                │
│ - Added unit tests for the CSV formatter                 │
│                                                          │
│ ## Notes for reviewer                                   │
│ The formatter in `csvUtils.js` is intentionally verbose  │
│ — kept simple over clever for maintainability            │
└────────────────────────────────────────────────────────┘

Open in browser to create PR with this description? [Y/n]
```

**Why it's good:** It reads the actual commit history of the branch (which, if you've been using `duck commit`, already has real reasoning in it) instead of you writing the description from scratch at the least energetic point in the whole process — right before hitting "create PR."

---

## 4. `duck clean`

**The hassle it solves:** Every repo eventually has 30 stale branches nobody trusts enough to delete, because nobody remembers which ones are safe.

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

**Why it's good:** It never deletes anything with unmerged, unique work — the "needs a look" bucket exists specifically so the tool never makes a destructive call it isn't sure about.

---

## 5. `duck stash-explain`

**The hassle it solves:** `git stash list` shows you "WIP on main: a1b2c3d" — completely useless by the third stash.

```
$ git stash list
stash@{0}: WIP on main: a1b2c3d
stash@{1}: WIP on feature/export: 9f8e7d6

$ duck stash-explain
✓ Reading stash diffs

stash@{0}: Half-finished dark mode toggle in Settings.jsx
            (CSS variables added, JS logic not wired up yet)
stash@{1}: Debugging attempt for the CSV export bug —
            added console.logs, no fix yet
```

**Why it's good:** It reads the actual diff inside each stash rather than trusting the auto-generated message, so six-stashes-deep you can still tell them apart in one glance.

---

## 6. `duck preflight`

**The hassle it solves:** Debug leftovers (`console.log`, commented-out blocks, half-finished TODOs) slipping into a push because nobody does a final read-through under deadline pressure.

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

**Why it's good:** It defaults to *not* pushing (`[y/N]`, capital N) when it finds something — the one place this tool is deliberately a little annoying, because catching this before a reviewer does is worth a five-second pause.

---

## 7. `duck sync-check`

**The hassle it solves:** Building for hours on a stale branch, then discovering a huge, painful rebase waiting at the end of the day.

```
$ duck sync-check
✓ Comparing local branch against origin/main

⚠ Your branch is 23 commits behind origin/main
  (last synced 4 days ago)

  Recommend pulling before continuing — the longer this
  gap grows, the harder the eventual merge/rebase gets.

Pull now? [Y/n]
```

**Why it's good:** It surfaces the problem when it's still small (a quick pull) instead of when it's already large (a multi-hour conflict resolution session).

---

## 8. `duck changelog`

**The hassle it solves:** Release notes get manually reconstructed from memory right before a release, usually missing half of what actually shipped.

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
│ - Duplicate validation logic (#215)                       │
│                                                            │
│ ### Chores                                                │
│ - Dependency updates (React 18.3 → 19.0)                  │
└────────────────────────────────────────────────────────┘

Save to CHANGELOG.md? [Y/n]
```

**Why it's good:** Since `duck commit` already tags each commit with a type (feat/fix/chore) as part of its style config, changelog generation is just reading back structured data that already exists — not a separate reconstruction effort.

---

## 9. `duck worklog`

**The hassle it solves:** Freelancers and interns needing to reconstruct "what did I actually do this week" for a timesheet or invoice, usually from memory the night before it's due.

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

**Why it's good:** Same principle as `duck standup`, extended to a longer range — it's built from actual git activity, so it's both more accurate and far less effort than reconstructing a week from memory.

---

## 10. `duck blame-explain`

**The hassle it solves:** `git blame` tells you *who* changed a line and *when* — never *why*, which is usually the thing you actually needed to know before touching it.

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

**Why it's good:** It turns `git blame` from "here's a hash and a name" into "here's the actual reasoning," which is the difference between confidently editing a line and accidentally re-breaking something someone already fixed once.

---

## 11. `duck deps`

**The hassle it solves:** Dependency updates get postponed indefinitely because "checking what changed" across 40 packages feels like a whole afternoon nobody has.

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

**Why it's good:** It separates "update this now, it's a security issue" from "this is a major bump, budget real time for it" — so the response to a dependency report isn't always "ignore it, sounds like a whole project."

---

## 12. `duck conflict-explain`

**The hassle it solves:** Merge conflicts show you `<<<<<<<` markers and two versions of code — never *why* the two branches diverged, which is what you actually need to resolve it correctly instead of just picking one side and hoping.

```
$ git merge feature/csv-export
CONFLICT (content): Merge conflict in src/utils/format.js

$ duck conflict-explain src/utils/format.js
✓ Reading both branch histories for this file

Your branch (main) changed this function to handle null
values safely (commit 3f2a1). The incoming branch
(feature/csv-export) changed the same function to support
a new date format (commit 9c4d2) — unrelated to the null
handling.

Suggested resolution: keep both changes — the null check
from main, applied to the new date-formatting logic from
the incoming branch. Want duck to draft the merged version?
```

**Why it's good:** It reads the *intent* behind both sides of the conflict instead of just showing you the raw diff markers, which is usually 80% of the actual work of resolving a conflict correctly.

---

## 13. `duck onboard`

**The hassle it solves:** New contributors (or future-you, six months later) spend their first day just figuring out project structure and conventions that live only in the current maintainer's head.

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

**Why it's good:** It generates onboarding docs from what the codebase and history *actually* show, rather than a manually-written doc that's always slightly out of date the moment someone changes the folder structure.

---

## Design Principle Across All Commands

Every command above follows the same three rules the core `duck commit` flow already established:

1. **Read real signal, don't guess** — commits, diffs, and history are the source of truth; the AI summarizes and structures, it doesn't invent.
2. **Ask only when the automation genuinely can't know** — most commands need zero human input; the ones that do (conflict resolution, ambiguous diffs) ask one focused question, not a form to fill out.
3. **Never take a destructive or misleading action silently** — deleting branches, pushing with warnings, or changing history all require an explicit confirmation shown right before the action, not buried in a flag.
