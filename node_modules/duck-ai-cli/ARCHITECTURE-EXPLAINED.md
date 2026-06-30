# Understanding duck
### Why each piece exists, and how it all fits together

This is the companion doc to `BUILD-GUIDE-FOR-ANTIGRAVITY.md`. That file tells your agent *what* to build. This one explains *why*, so you're not just handing off a spec you don't understand yourself.

---

## The Core Idea in One Sentence

Most AI commit-message tools just summarize a diff. This one is different because it **asks you a question when the diff itself doesn't reveal your intent** — which is the actual reason commit messages are often useless six months later.

---

## Why a CLI + Git Hook, Not a Standalone App

If this were a separate app you had to open, you'd stop using it within a week — that's true of almost every "productivity tool" that isn't attached to something you already do. Git commits happen dozens of times a day for an active developer. By hooking into `git commit` itself (via the `prepare-commit-msg` hook), the tool activates automatically, at the exact moment it's useful, with zero extra habit required from you.

This is the same principle from your other projects, like Context Relay injecting into existing chat platforms instead of being its own destination.

---

## Why the Diff Is the Input, Not a Description You Type

The diff is the one source of truth for *what* changed. Asking you to describe your change in your own words defeats the purpose — you'd just be writing the commit message yourself, which is the exact problem this tool solves. The AI reads the diff, and only asks you something when the diff is genuinely ambiguous about *why*.

---

## Why There's a Separate "Ambiguity Detection" Step

If the AI asked a question on every single commit, you'd disable the tool within a day — nobody wants an interrogation for a one-line typo fix. The system deliberately separates two AI calls:

1. **Draft** — always happens, cheap, fast
2. **Ambiguity check** — only produces a question if something in the diff is unclear (a check was removed, a magic number appeared, a function was renamed without an obvious reason)

This keeps the tool feeling like a helpful nudge instead of friction. The `maxQuestions` config setting exists so you can tune this further — some people will want zero questions ever, some will want it strict.

---

## Why Groq (and Ollama as backup) Instead of a Paid API

You said budget is a hard constraint, so this matters:

- **Groq** gives you free API access to fast, capable open models. It's the default because it needs no local setup — you just need an API key.
- **Ollama** runs models entirely on your own machine. Zero cost, no rate limits, no internet dependency at all. This is your fallback if you ever hit a free-tier ceiling on Groq, or if you just want everything to run 100% locally and privately.

The architecture never hardcodes one provider directly into the logic — there's a single `getCompletion()` abstraction that routes to whichever provider your config points to. That means if a better free option shows up later, you swap one file, not your whole codebase.

---

## Why There's a Config File (`.duckrc`) Instead of Hardcoded Behavior

Every team (and every mood) wants commits formatted differently — Conventional Commits, gitmoji, plain English, or your own house style. Hardcoding one format means the tool only works for people who happen to like your default. The config file separates **policy** (how a commit should look) from **mechanism** (how the tool gets there), which is a pattern worth internalizing generally — it's the same reason frameworks expose config files instead of forcing one opinion.

The "duck personality" setting is the same idea applied to tone rather than format — it changes *how* the question is asked, never *what* it's asking about, so playfulness never costs you accuracy.

---

## Why There's a Secret Scanner Before Anything Gets Sent Externally

Any tool that sends your code to an external API is a potential leak vector if you're not careful — and a lot of real leaked API keys in the wild started as an innocent diff sent somewhere without a second thought. The scanner runs *before* the diff leaves your machine, and if it spots something that looks like a credential, it stops and asks you to confirm rather than silently sending it. This is a small piece of code that matters disproportionately to your safety as a developer, which is why it's called out as a "build early" priority in the build guide even though it's not part of the flashy feature list.

---

## Why There's a Cache

Free-tier API access is generous but not infinite. If you run `duck commit`, decide to stage one more small change, and run it again, there's no reason to burn a second API call on a diff that's 95% the same. The cache hashes your staged diff and skips the AI call entirely if nothing's changed since last time — this directly protects your free-tier quota, which matters a lot more to you than to someone with a company card.

---

## Why the Tool Never Blocks a Commit

Every failure path in the build guide — no API key, network down, API timeout — degrades to a fallback instead of crashing or refusing to commit. A tool that occasionally *prevents* you from committing is worse than no tool at all, because you'll uninstall it the first time it gets in your way during something urgent. Reliability of the "escape hatch" is what earns the tool the right to be automatic in the first place.

---

## How a Single Commit Actually Flows Through the System

1. You run `git commit` (or type `duck commit` directly)
2. `getDiff.js` grabs your staged changes
3. `secretScan.js` checks nothing sensitive is about to leave your machine
4. `diffCache.js` checks if this exact diff was already processed recently
5. `draftMessage.js` asks the AI for a first-pass commit message
6. `detectAmbiguity.js` asks a second, narrower question: *is there anything here worth clarifying?*
7. If yes → `askQuestion.js` shows you one short question in the terminal
8. Your answer + the original draft go back to the AI to produce a final message
9. You see the final message and choose: commit as-is, edit it, or cancel
10. `commit.js` runs the real `git commit -m "..."` with your approved message

Every piece in the folder structure maps directly to one step in this list — nothing in the codebase should exist that isn't traceable back to one of these ten steps or one of the safety/efficiency concerns above.

---

## What "Wonderful" Actually Means Here

The extended features in the build guide (style-matching from your own git history, the weekly digest, duck personalities) aren't there to look impressive in a demo. They're there because a tool only becomes part of your daily life if it occasionally does something that makes you go "oh, that's nice" — without ever asking more of you than the ten-step flow above. Build the core flow rock-solid first; the delight features are what turn "useful" into "I'd miss this if it were gone."
