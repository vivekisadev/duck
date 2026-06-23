# Build Guide: duck
### (Hand this file to your AI coding agent as its primary instruction set)

---

## 0. Project Summary (read this first)

Build a CLI tool called **`duck`** that hooks into the git commit workflow. Instead of a developer typing a commit message from scratch, `duck`:

1. Reads the staged diff (`git diff --staged`)
2. Sends it to a **free** LLM API and gets back a draft commit message
3. If the LLM detects something ambiguous in the diff (a removed check, a magic number, a renamed function with unclear intent), it asks the developer **one short clarifying question** in the terminal — like a rubber duck
4. Merges the developer's answer into the final commit message
5. Lets the developer confirm/edit before committing

**Non-negotiable constraint: the AI API used must be free.** Do not integrate any paid-only API as the default. See Section 2 for the exact provider to use.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Language/runtime | Node.js (v18+) | Best ecosystem for CLI tools + npm distribution |
| CLI framework | `commander` or `yargs` | Standard, well-documented, low overhead |
| Interactive prompts | `inquirer` (or `prompts`) | For the "duck question" and confirm/edit step |
| Terminal styling | `chalk` | Makes the duck feel alive, not a wall of plain text |
| Step/progress UI | `listr2` | Renders the live step list with spinner → checkmark per step (see Section 9) |
| Boxed output | `boxen` | Puts the final commit message in a clean bordered box before the confirm prompt |
| Symbols | `figures` | Cross-platform tick/cross/pointer glyphs so the UI looks right on Windows terminals too |
| Git interaction | `simple-git` or raw `child_process.exec('git ...')` | Reading staged diff, writing commit |
| AI provider | **Groq API** (primary) + **Ollama** (offline fallback) | Both free — see Section 2 |
| Config | Plain JSON or YAML file (`.duckrc`) | Per-repo and global settings, style profiles |
| Local cache | Simple JSON file keyed by diff hash | Avoid re-calling the API on identical staged diffs |
| Packaging | npm package with a `bin` entry | So `npm install -g` gives a global `duck` command |

---

## 2. AI Provider (Free-Tier Requirement)

Use **Groq** (https://console.groq.com) as the default provider:
- Free API key from their console
- Fast inference on open models (e.g., Llama 3.x family — confirm current model names on their docs, as they update)
- No credit card required for the free tier at time of writing — **the agent should verify current terms on console.groq.com before hardcoding assumptions**, since free-tier limits can change

Provide a **second, fully-offline option** using **Ollama** (https://ollama.com):
- Runs entirely on the developer's machine, zero API cost, zero rate limits, no internet required
- Use for developers who don't want to sign up for anything, or who hit Groq rate limits
- Suggested default local model: a small instruction-tuned model (e.g., `llama3.2` or similar lightweight model — pick based on what's available in Ollama's library at build time)

**Design requirement:** the AI call must go through a single internal abstraction (e.g., `getCompletion(prompt)`) so the provider is swappable via config. Never hardcode a specific vendor's SDK call directly inside business logic.

```
duck.config.json
{
  "provider": "groq",       // or "ollama"
  "model": "llama-3.3-70b-versatile", // confirm exact current model slug at build time
  "apiKeyEnvVar": "DUCK_GROQ_API_KEY"
}
```

Never require the user to pay. If no API key is set and Ollama isn't running, fall back to a **heuristic-only mode** (Section 8) rather than blocking the commit.

---

## 3. Folder Structure

```
duck/
├── bin/
│   └── duck.js                # CLI entry point
├── src/
│   ├── cli.js                 # command parsing (commander/yargs setup)
│   ├── git/
│   │   ├── getDiff.js         # runs `git diff --staged`
│   │   └── commit.js          # runs the actual `git commit -m "..."`
│   ├── ai/
│   │   ├── provider.js        # abstraction layer — routes to groq.js or ollama.js
│   │   ├── groq.js            # Groq API integration
│   │   ├── ollama.js          # Ollama local integration
│   │   └── prompts.js         # all prompt templates live here, not scattered in logic
│   ├── duck/
│   │   ├── draftMessage.js    # diff -> draft commit message
│   │   ├── detectAmbiguity.js # diff -> is there something worth asking about?
│   │   └── askQuestion.js     # terminal interactive Q&A (inquirer)
│   ├── cache/
│   │   └── diffCache.js       # hash staged diff, skip re-calling AI if unchanged
│   ├── config/
│   │   └── loadConfig.js      # reads .duckrc / duck.config.json, merges with defaults
│   ├── security/
│   │   └── secretScan.js      # regex-based scan for API keys/passwords in diff before sending anywhere
│   ├── commands/               # one file per additional command (Section 10)
│   │   ├── standup.js
│   │   ├── pr.js
│   │   ├── clean.js
│   │   ├── stashExplain.js
│   │   ├── preflight.js
│   │   ├── syncCheck.js
│   │   ├── changelog.js
│   │   ├── worklog.js
│   │   ├── blameExplain.js
│   │   ├── deps.js
│   │   ├── conflictExplain.js
│   │   └── onboard.js
│   └── hook/
│       └── installHook.js     # writes the git prepare-commit-msg hook
├── package.json
├── README.md
└── .duckrc.example
```

---

## 4. Build Phases (build and test in this order)

### Phase 1 — Bare CLI skeleton
- Set up `package.json` with a `bin` field pointing to `bin/duck.js`
- Implement `duck --version` and `duck --help`
- Implement `getDiff.js`: run `git diff --staged`, return as a string, handle the "nothing staged" case with a clear message

**Acceptance check:** running `duck diff` in any git repo with staged changes prints the raw diff.

### Phase 2 — AI draft message (no questions yet)
- Implement `provider.js` as a single exported function `getCompletion(prompt, config)`
- Implement `groq.js` calling Groq's chat completions endpoint (OpenAI-compatible format)
- Implement `draftMessage.js`: takes the diff, builds a prompt (see Section 5), calls `getCompletion`, returns a one-line commit message + optional body
- Wire up `duck commit --dry-run` to print the AI-drafted message without committing

**Acceptance check:** `duck commit --dry-run` returns a sensible commit message for a real staged diff.

### Phase 3 — Ambiguity detection ("the duck part")
- Implement `detectAmbiguity.js`: a second AI call (or extend the same call — agent should decide based on token efficiency) that returns structured JSON: `{ needsQuestion: bool, question: string, reason: string }`
- Ask the model to only flag genuinely ambiguous changes (removed checks, unexplained magic numbers, renamed functions/variables with unclear purpose) — not every diff needs a question
- Implement `askQuestion.js` using `inquirer` to show the question and capture the developer's free-text answer

**Acceptance check:** a diff that removes a null-check or validation triggers a question; a trivial diff (e.g., formatting-only change) does not.

### Phase 4 — Merge answer into final message + confirm/edit
- After the developer answers, send the original draft + the Q&A pair back to the AI to produce a final, polished commit message
- Show the final message with `chalk` styling and an `inquirer` confirm prompt: **[Y] commit / [n] cancel / [e] edit manually**
- If "edit," open the message in the developer's `$EDITOR` (or a simple inline text prompt) before committing
- Implement `commit.js`: actually run `git commit -m "<message>"`

**Acceptance check:** full end-to-end flow — `duck commit` → draft → question (if any) → final message → confirm → real commit lands in git log.

### Phase 5 — Git hook integration (make it automatic)
- Implement `installHook.js`: writes/updates `.git/hooks/prepare-commit-msg` in the current repo to call `duck` automatically on every `git commit`
- Add `duck install-hook` and `duck uninstall-hook` commands
- Must not break normal `git commit -m "..."` usage for developers who want to bypass it — respect a `--no-duck` flag or an env var like `DUCK_DISABLE=1`

**Acceptance check:** running plain `git commit` (no `-m`) in a repo with the hook installed triggers the full duck flow automatically.

### Phase 6 — Config & style profiles
- Implement `.duckrc` (JSON or YAML) supporting:
  - `provider` / `model` (Section 2)
  - `style`: `"conventional-commits"` | `"gitmoji"` | `"plain"` | `"custom"` with a user-supplied template
  - `duckPersonality`: `"neutral"` | `"encouraging"` | `"strict-senior-dev"` | `"sarcastic"` — changes the tone of the clarifying question only, never the factual content
  - `maxQuestions`: cap how many clarifying questions per commit (default 1)
- Config resolution order: repo-level `.duckrc` > user global config (`~/.duckrc`) > built-in defaults

**Acceptance check:** switching `style` to `"gitmoji"` visibly changes the format of drafted messages without touching any other code path.

### Phase 7 — Extended features (build after Phase 1–6 are solid)
See Section 6 for the full list and why each matters. Prioritize in this order:
1. Diff caching (avoid duplicate API calls — cheap to build, saves free-tier quota)
2. Secret/credential scanner (safety-critical, build early if time allows)
3. Style-matching from the user's own git log history
4. Weekly commit digest command (`duck digest`)
5. Everything else in Section 6 is optional polish

### Phase 8 — Packaging
- Ensure `package.json` has correct `bin`, `main`, `files` fields
- Write a clear `README.md`: install instructions, `duck install-hook`, config example, free-tier setup steps for Groq
- Test a local global install: `npm link` then run `duck` from an unrelated directory to confirm it works outside the project folder
- (Optional, later) publish to npm under an available package name

---

## 5. Prompt Design Requirements

All prompts live in `src/ai/prompts.js`, not inline in logic files. Each prompt function must:
- Take the diff (and, for later calls, prior context) as input
- Explicitly instruct the model to return **structured output** (JSON) when the calling code needs to parse a decision (e.g., `needsQuestion`), not free text
- Explicitly instruct the model to keep the first line of any commit message under ~72 characters (standard git convention)
- Explicitly instruct the model to never invent details not present in the diff — if it isn't sure why something changed, that's exactly when it should ask a question instead of guessing

---

## 6. Extended Feature List (for the "wonderful" factor)

Build these after the core loop (Phases 1–6) works end-to-end. Each includes why it matters — include this reasoning in code comments so future-you (or another agent) understands intent, not just implementation.

1. **Style-matching from git history** — On first run in a repo, read the last ~50 commit messages and infer the team's actual style (length, emoji use, tense) instead of forcing a generic convention.
2. **Secret/credential scanner** — Before *any* diff is sent to an external API, scan for patterns resembling API keys, tokens, or passwords and redact/warn before sending. Critical for trust — a broke developer especially cannot afford a leaked key.
3. **Diff caching** — Hash the staged diff; if unchanged since the last `duck` call (e.g., developer re-ran the command), reuse the cached draft instead of burning another API call.
4. **Duck personality profiles** — Purely cosmetic tone changes (Section 4, Phase 6) that make the tool feel less robotic and more like a personality developers enjoy interacting with daily.
5. **Weekly commit digest (`duck digest`)** — Summarizes the week's commits into a short human-readable recap ("18 commits, mostly refactors in the auth module") — a small, satisfying "look what I built" moment.
6. **Semantic version bump suggestion** — When a diff looks like a breaking change (removed public function, changed function signature), suggest whether this should be a major/minor/patch bump.
7. **Offline heuristic fallback** — If no AI provider is reachable at all, fall back to a simple rule-based message (e.g., based on changed file names/counts) so the tool never blocks a commit entirely.
8. **Squash-friendly summary** — Before a `git rebase -i` or push, offer to summarize a range of commits into one clean message for squashing.
9. **VS Code companion (future, separate project)** — Same core logic surfaced as a sidebar instead of terminal-only, for developers who prefer GUI git tools.

---

## 7. Error Handling Requirements (must-have, not optional)

- No staged changes → clear message, exit cleanly, do not call the AI
- No API key set and Ollama not running → fall back to heuristic mode (Section 6.7), never crash
- API request fails/times out → retry once, then fall back to heuristic mode with a visible warning
- Developer cancels at the confirm step → abort the commit cleanly, no partial state left behind
- Any secret detected in the diff (Section 6.2) → warn loudly and require explicit confirmation before proceeding, default action should be to NOT send that content externally

---

## 8. CLI Visual Experience (Step Indicators & Animation)

This is not cosmetic polish bolted on at the end — build it alongside Phases 2–4, since each step in the visual list maps to a real async operation already happening in the code.

### Required step list (in order)
1. Reading staged diff
2. Scanning for secrets
3. Drafting commit message
4. Checking for ambiguity
5. *(conditional)* the duck's question — only appears if `detectAmbiguity.js` returns `needsQuestion: true`
6. Finalizing message
7. Ready to commit — shows the final message boxed, then the confirm prompt

### Visual behavior per step
- Pending step: dim/gray circle glyph, gray text
- Active step: spinner glyph (animated), full-brightness text
- Completed step: green checkmark glyph, text stays visible (not collapsed away — the developer should be able to see the whole flow that just happened)
- The duck's question step: use a distinct color (amber/yellow) and a distinct glyph (e.g., a speech-bubble icon) so it visually stands out from the automated steps — this is the one moment a human is actually involved
- The final commit message: rendered inside a bordered box (`boxen`) so it's visually separated from the step list above it, right before the Y/n/edit confirm prompt

### Implementation notes
- Use `listr2`'s task list renderer to manage the spinner → checkmark transitions automatically rather than hand-rolling terminal cursor control
- Each `listr2` task's `task()` function should wrap the actual async call (diff read, AI call, secret scan) — the visual step and the real operation must be the same code path, never a fake delay for show
- The duck's question must pause the task list cleanly, run the `inquirer` prompt, then resume — `listr2` supports injecting prompts mid-run; consult its docs for the current API rather than assuming
- Respect a `--quiet` / `--no-animation` flag for CI environments or developers who prefer plain output — animated spinners can break in non-TTY contexts (e.g. piped output), so detect `process.stdout.isTTY` and fall back to plain logged lines automatically when it's `false`

### Acceptance check
Running `duck commit` on a real staged diff shows each step transition live from pending → spinner → checkmark, the duck's question appears in its own color when triggered, and the final message appears in a bordered box before the commit confirmation — all without any fake/simulated delays where real work isn't happening.

---

## 9. Timewarp — Backdated / Distributed Commits

### What it does
A command, `duck timewarp`, that commits staged (or queued) changes with a git author/committer date other than "now" — either one specific date, or a range with the changes distributed across it.

```
duck timewarp --date 2026-06-20
duck timewarp --range 2026-06-01:2026-06-25 --commits 14 --distribution even
duck timewarp --range 2026-06-01:2026-06-25 --commits 14 --distribution weighted-recent
```

### Why this needs an honesty guardrail (read before building)
This feature has a real, legitimate use: a developer who genuinely worked locally for weeks without committing wants their git history to reflect when the work actually happened, instead of everything landing as one commit dated "today." That's a real workflow gap worth solving.

The same mechanism can also be used to make a contribution graph *look* like consistent work happened when it didn't — which misleads anyone (a recruiter, a teammate, a professor) who reasonably assumes commit history reflects real activity. Build the feature, but build the guardrail in from the start rather than bolting it on later:

- On first use, print a one-time, non-dismissible-without-reading notice: *"This changes when commits appear to have happened. Use it to reflect real work, not to misrepresent your timeline to others."*
- Always show the heatmap-style preview (Section 9a) and require explicit confirmation before any commit is made — never a silent/`--yes`-by-default mode for this specific command, even though other duck commands can be quieted.
- Do not build a mode that auto-detects "make this look active" — the range and commit count are always something the developer explicitly supplies, never something duck suggests to "improve" a graph.

### How the diff gets split into multiple commits
If there's one large staged diff but the user wants N commits across a range, duck needs to split it into N logical pieces first:
- Reuse the existing AI draft pipeline (`draftMessage.js`), but prompt it to propose a split by file or by logical hunk grouping, each with its own draft message
- Fall back to a simple per-file split if the AI can't find a clean logical grouping
- Each resulting chunk is staged and committed independently via `git add <files>` / `git add -p`, then committed with `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` env vars set (both must match — mismatched author/committer dates are a common tell that a commit was backdated)

### Distribution options
| Mode | Behavior |
|---|---|
| `even` | Spreads commits roughly uniformly across the range |
| `random` | Random dates/times within the range, biased toward plausible working hours |
| `weighted-recent` | More commits cluster near the end of the range (ramping up toward a deadline) |
| `custom` | User supplies an explicit list of dates, one per commit |

### 9a. Preview step (required before any commit happens)
Before executing anything, render a small heatmap-style calendar (like a GitHub contribution graph) showing exactly which days will get how many commits, plus the total count and range. Require a Y/n confirmation on this preview — this is the same "never commit blind" principle as the main duck flow, just applied here too.

### Acceptance check
`duck timewarp --range <dates> --commits N` on a real staged diff produces N separate commits, each dated within the range according to the chosen distribution, each with matching author/committer dates, only after the developer sees and confirms the preview.

---

## 10. Additional Commands (Build After Core Loop Is Stable)

Build these only after `duck commit` (Phases 1–6) and the CLI visual spec (Section 8) are solid — every command below reuses the same AI abstraction (`getCompletion`), the same visual step-list pattern, and the same "confirm before acting" rule. Each entry lists: the hassle it solves, the implementation file, expected usage, and its acceptance check.

### 10.1 `duck standup` — `src/commands/standup.js`
Reads commits since a given time (default: yesterday same time) and groups them into a short, readable summary by theme, not a raw commit list.
```
$ duck standup
✓ Reading commits since yesterday 9:00 AM
✓ Grouping by theme
[boxed summary output]
Copy to clipboard? [Y/n]
```
**Acceptance check:** run against a repo with 5+ commits from the last day; output groups related commits together rather than listing them 1:1.

### 10.2 `duck pr` — `src/commands/pr.js`
Compares current branch against a base (default `main`), reads all commits unique to the branch, and drafts a full PR description (what/why/testing/reviewer notes).
```
$ duck pr
✓ Comparing feature/csv-export against main
✓ Reading 14 commits
✓ Drafting description
[boxed PR description]
Open in browser to create PR with this description? [Y/n]
```
**Acceptance check:** description includes distinct What/Why/Testing sections and reflects actual commit content, not generic placeholder text.

### 10.3 `duck clean` — `src/commands/clean.js`
Scans local + remote branches, classifies each as safely deletable (merged, no unique commits) or "needs a look" (unmerged/stale).
```
$ duck clean
✓ Scanning local and remote branches
✓ Checking merge status against main
[boxed report: safe-to-delete vs needs-a-look]
Delete the 2 safe branches? [Y/n]
```
**Acceptance check:** never proposes deleting a branch with unmerged unique commits — false negatives (missing a safe branch) are acceptable, false positives (flagging an unsafe one) are not.

### 10.4 `duck stash-explain` — `src/commands/stashExplain.js`
Reads the actual diff inside each stash and rewrites its description to say what's really in it, replacing the default "WIP on main: <hash>" messages.
```
$ duck stash-explain
✓ Reading stash diffs
stash@{0}: Half-finished dark mode toggle in Settings.jsx
stash@{1}: Debugging attempt for the CSV export bug
```
**Acceptance check:** works correctly with 5+ stashes queued simultaneously, each description distinct and diff-grounded.

### 10.5 `duck preflight` — `src/commands/preflight.js`
Scans staged + unstaged changes for debug leftovers: `console.log`/`print` statements, large commented-out blocks, and TODOs that look unresolved in security/auth-sensitive files.
```
$ duck preflight
✓ Scanning staged + unstaged changes
[boxed warnings list]
Push anyway? [y/N]
```
**Design note:** this is the one command that defaults to blocking (`[y/N]`, capital N) rather than allowing — intentional friction, not a bug.
**Acceptance check:** flags a deliberately-inserted `console.log` and commented-out block in a test diff; does not false-positive on legitimate logging calls behind a debug flag.

### 10.6 `duck sync-check` — `src/commands/syncCheck.js`
Compares local branch against its remote tracking branch; warns if behind by more than a configurable threshold (default: 10 commits or 3 days).
```
$ duck sync-check
✓ Comparing local branch against origin/main
⚠ Your branch is 23 commits behind origin/main
Pull now? [Y/n]
```
**Acceptance check:** threshold is configurable via `.duckrc`; does not warn when branch is up to date or within threshold.

### 10.7 `duck changelog` — `src/commands/changelog.js`
Reads all commits between two git tags/refs, groups them by type (feat/fix/chore — reusing the same type tagging from `duck commit`'s style config), and drafts release notes.
```
$ duck changelog --from v1.2.0 --to v1.3.0
✓ Reading 41 commits between tags
✓ Grouping by type
[boxed release notes]
Save to CHANGELOG.md? [Y/n]
```
**Acceptance check:** correctly groups a test set of commits by their existing type prefixes; appends to CHANGELOG.md without overwriting prior entries.

### 10.8 `duck worklog` — `src/commands/worklog.js`
Same mechanism as `duck standup`, extended to an arbitrary date range, formatted for timesheet/invoicing use (day-by-day breakdown).
```
$ duck worklog --range "this week"
✓ Reading commits from Mon–Fri
✓ Grouping by day
[boxed day-by-day summary]
Export as PDF for invoicing? [Y/n]
```
**Acceptance check:** correctly parses natural-language ranges ("this week," "last month") as well as explicit date ranges.

### 10.9 `duck blame-explain <file>:<line>` — `src/commands/blameExplain.js`
Runs `git blame` on the target line, then reads the full commit message and diff context of the commit that last changed it, and explains *why* the change was made — not just who/when.
```
$ duck blame-explain src/utils/validate.js:42
✓ Reading commit history for this line
✓ Reading the original commit message and diff context
[explanation of why the line is the way it is]
```
**Acceptance check:** explanation references the actual original commit message content, not a generic restatement of the diff.

### 10.10 `duck deps` — `src/commands/deps.js`
Checks installed package versions against latest available and cross-references known security advisories (use a free vulnerability data source — e.g., the npm audit data already available via `npm audit --json`, parsed and re-summarized in plain English rather than calling a separate paid service).
```
$ duck deps
✓ Checking installed packages against latest versions
✓ Cross-referencing known security advisories
[boxed report: security-critical vs. major-version-bump vs. up-to-date]
```
**Acceptance check:** correctly separates "security fix available" from "major version available, review breaking changes" — these must never be conflated into one generic "update available" bucket.

### 10.11 `duck conflict-explain <file>` — `src/commands/conflictExplain.js`
During an active merge conflict, reads both branches' history for the conflicting file and explains why each side changed it, then optionally offers to draft a merged resolution.
```
$ duck conflict-explain src/utils/format.js
✓ Reading both branch histories for this file
[explanation of both sides' intent + suggested resolution]
Want duck to draft the merged version? [Y/n]
```
**Acceptance check:** correctly identifies when two changes are unrelated (both can be kept) vs. genuinely contradictory (one must be chosen) — never silently picks a side without flagging which case it is.

### 10.12 `duck onboard` — `src/commands/onboard.js`
Reads project folder structure and recent commit history/conventions, generates an `ONBOARDING.md` covering structure, where core logic lives, commit conventions actually followed, and common gotchas found in recent bug-fix commits.
```
$ duck onboard
✓ Reading project structure
✓ Reading recent commit patterns and code conventions
✓ Generated ONBOARDING.md
```
**Acceptance check:** generated doc reflects the actual current folder structure (re-running after a restructure should update it, not leave stale content).

### General rules across all commands in this section
- Every command routes through the existing `getCompletion()` abstraction (Section 2) — never a new, separate AI integration per command
- Every command that reads history must handle the "not enough history yet" case gracefully (e.g., a brand-new repo) rather than erroring
- Every destructive or state-changing action (`clean`, `changelog` writing to a file, `stash-explain` if it rewrites stash messages) requires the same explicit confirm pattern established in the core flow

---

## 11. Definition of Done (MVP)

- [ ] `duck commit` produces a draft message from a real staged diff
- [ ] Ambiguous diffs trigger exactly one clarifying question (respecting `maxQuestions`)
- [ ] Developer's answer is merged into a final, editable, confirmable commit message
- [ ] `duck install-hook` makes this automatic on plain `git commit`
- [ ] Works with a free Groq API key out of the box; works fully offline via Ollama as an alternative
- [ ] No crash paths — every failure degrades gracefully instead of blocking the developer
- [ ] README documents setup in under 5 minutes for a new developer with zero budget

**Note:** the commands in Section 10 (`standup`, `pr`, `clean`, etc.) are valuable but are explicitly *not* part of the MVP definition above — ship the core `duck commit` loop solid first, then layer these in one at a time.
