import React, { useState, useRef, useEffect } from 'react';

const mockResponses = {
  'duck commit': `✓ Reading staged diff
✓ Scanning for secrets
✓ Drafting commit message
✓ Checking for ambiguity
🦆 Quick one: this removes a null check — handled elsewhere now, or dropped?
> handled upstream in validateInput()
✓ Finalizing message

┌─────────────────────────────────────────────────────────┐
│ fix(auth): remove redundant null check, now validated   │
│ upstream in validateInput()                             │
└─────────────────────────────────────────────────────────┘`,

  'duck standup': `✓ Reading commits since yesterday 9:00 AM
✓ Grouping by theme

┌─ Yesterday ────────────────────────────────────────────┐
│ • Fixed a race condition in the auth token refresh flow│
│ • Refactored the user validation logic into a helper   │
│ • Started the CSV export feature — schema done, UI     │
│   still pending                                        │
└────────────────────────────────────────────────────────┘`,

  'duck pr': `✓ Comparing current branch against main
✓ Reading 14 commits
✓ Drafting description

┌─ Pull Request Draft ──────────────────────────────────┐
│ ## What                                               │
│ Adds CSV export for the reports page                  │
│                                                       │
│ ## Why                                                │
│ Users have been manually screenshotting tables — this │
│ was the #2 requested feature in last month's survey   │
└───────────────────────────────────────────────────────┘`,

  'duck clean': `✓ Scanning local and remote branches
✓ Checking merge status against main

┌─ Branch Report ─────────────────────────────────────────┐
│ Safe to delete (merged, no unique commits):             │
│   ✓ feature/old-login-page      (merged 3 months ago)   │
│   ✓ fix/typo-readme             (merged 1 month ago)    │
│                                                         │
│ Needs a look (unmerged, but stale):                     │
│   ⚠ feature/dark-mode           (last commit 6 wks ago) │
└─────────────────────────────────────────────────────────┘`,

  'duck stash-explain': `✓ Reading stash diffs

stash@{0}: Half-finished dark mode toggle in Settings.jsx
            (CSS variables added, JS logic not wired up yet)
stash@{1}: Debugging attempt for the CSV export bug —
            added console.logs, no fix yet`,

  'duck preflight': `✓ Scanning staged + unstaged changes

┌─ Preflight Warnings ────────────────────────────────────┐
│ ⚠ src/api/users.js:42 — console.log left in             │
│ ⚠ src/hooks/useAuth.js:15 — "TODO: handle expired token"│
└─────────────────────────────────────────────────────────┘`,

  'duck sync-check': `✓ Comparing local branch against origin/main

⚠ Your branch is 23 commits behind origin/main
  (last synced 4 days ago)

  Recommend pulling before continuing — the longer this
  gap grows, the harder the eventual merge/rebase gets.`,

  'duck changelog': `✓ Reading 41 commits between tags
✓ Grouping by type

┌─ v1.3.0 Release Notes ──────────────────────────────────┐
│ ### Features                                            │
│ - CSV export for reports (#212)                         │
│ - Dark mode toggle (#198)                               │
│                                                         │
│ ### Fixes                                               │
│ - Auth token refresh race condition (#221)              │
└─────────────────────────────────────────────────────────┘`,

  'duck worklog': `✓ Reading commits from Mon–Fri
✓ Grouping by day

┌─ Week of Jul 7–11 ───────────────────────────────────────┐
│ Mon: Auth token refresh fix, code review feedback        │
│ Tue: CSV export — schema + backend endpoint              │
│ Wed: CSV export — frontend UI                            │
│ Thu: Bug fixes from QA pass                              │
│ Fri: PR reviews, dependency updates                      │
└──────────────────────────────────────────────────────────┘`,

  'duck blame-explain': `✓ Reading commit history for this line
✓ Reading the original commit message and diff context

Line 42 was last changed in commit 7f3a9c1
"fix(validate): loosen email regex to allow + aliases"

Context: the original regex rejected valid emails like
alice+newsletter@gmail.com — this was a bug fix, not a
simplification. Changing it back would reintroduce that bug.`,

  'duck deps': `✓ Checking installed packages against latest versions
✓ Cross-referencing known security advisories

┌─ Dependency Report ──────────────────────────────────────┐
│ ⚠ lodash 4.17.15 → 4.17.21 (fixes prototype pollution)   │
│ ℹ react 18.2.0 → 19.0.0 (major version breaking changes) │
│ ✓ express, axios, dotenv — up to date                    │
└──────────────────────────────────────────────────────────┘`,

  'duck resolve': `✓ Reading both branch histories for this file

Your branch (main) changed this function to handle null
values safely (commit 3f2a1). The incoming branch
(feature/csv-export) changed the same function to support
a new date format (commit 9c4d2) — unrelated to the null
handling.

Suggested resolution: keep both changes.`,

  'duck onboard': `✓ Reading project structure
✓ Reading recent commit patterns and code conventions

✓ Generated ONBOARDING.md:
  - Project structure overview
  - Where the "real" logic lives vs. boilerplate
  - Commit message conventions this repo actually follows
  - Common gotchas found in recent bug-fix commits`,

  'duck init': `🦆 Checking environment...

ℹ You don't need to initialize me! 
As long as this directory has a .git/ folder, I'm already hooked into your workflow.

Try running 'duck commit' or 'duck standup' directly.`,

  'duck diff': `✓ Scanning staged files
  
src/api/auth.js |  4 ++--
src/utils.js    | 12 ++++++++++--
2 files changed, 12 insertions(+), 4 deletions(-)`,

  'duck install-hook': `✓ Hooking into .git/hooks/prepare-commit-msg
🦆 The duck is now perched on your commit flow! 
It will automatically trigger when you run 'git commit'.`,

  'duck uninstall-hook': `✓ Removing hook from .git/hooks/prepare-commit-msg
🦆 Hook removed. You're flying solo now.`,

  'duck digest': `✓ Generating digest for the past 7 days...

┌─ Weekly Digest ──────────────────────────────────────────┐
│ Team Velocity: 34 commits across 4 branches            │
│ Main themes:                                           │
│  - Rebuilt the settings dashboard (14 commits)         │
│  - Patched authentication memory leak (6 commits)      │
└──────────────────────────────────────────────────────────┘`,

  'duck radar': `🦆 Launching radar dashboard...
[Simulated] Radar is a persistent TUI dashboard that monitors your repo state in real-time.`,

  'duck force-push': `✓ Creating local backup tag: backup/pre-force-push-a1b2c3d
✓ Force pushing to origin/main...

🦆 Done! If you messed up, you can recover via the backup tag.`,

  'duck reset': `✓ Creating local backup tag: backup/pre-reset-a1b2c3d
✓ Hard resetting to HEAD~1...

🦆 Done! Reset complete.`,

  'duck goto': `✓ Checking out branch feature/csv-export...
🦆 Switched to feature/csv-export safely.`,

  'duck fetch': `✓ Fetching from origin...
🦆 3 new remote branches found. Your local main is up to date.`,

  'duck pull': `✓ Fetching from origin...
✓ Fast-forwarding main...
🦆 Pull complete. No merge conflicts detected!`,

  'duck ignore-audit': `✓ Scanning tracked files against common .gitignore patterns...
✓ Scanning for known build artifacts (.DS_Store, node_modules, etc)...

🦆 Audit clear! No secrets or junk files are being tracked.`,

  'duck history-scan': `✓ Scanning all 1,432 commits in repository history for secrets...
🦆 History scan clear! No AWS keys or tokens found in your commit history.`,

  'duck timewarp': `✓ Distributing staged changes into 5 commits
✓ Assigning dates between 2026-06-01 and 2026-06-25...

[timewarp a1b2c3] feat: add auth validation (2026-06-03)
[timewarp d4e5f6] fix: token refresh loop (2026-06-10)
[timewarp g7h8i9] chore: update dependencies (2026-06-15)
...
🦆 Timewarp complete! Your graph looks busy.`,

  'duck backdate': `✓ Distributing staged changes into 5 commits
✓ Assigning dates between 2026-06-01 and 2026-06-25...

[timewarp a1b2c3] feat: add auth validation (2026-06-03)
[timewarp d4e5f6] fix: token refresh loop (2026-06-10)
[timewarp g7h8i9] chore: update dependencies (2026-06-15)
...
🦆 Backdate (timewarp) complete! Your graph looks busy.`,
};

const helpMenu = `🦆 Welcome to Duck CLI — The AI-Powered Developer's Best Friend! 🦆

Duck hooks into your standard git workflow to eliminate chores, answer the "why" behind code changes, and keep your repo sparkling clean.

--- Available Sandbox Commands ---
  duck commit           Draft context-rich commit messages
  duck pr               Draft a Pull Request description
  duck standup          Summarize your recent commits
  duck worklog          Generate a weekly worklog for timesheets
  duck blame-explain    Explain WHY a specific line of code was changed
  duck resolve          Resolve merge conflicts with AI
  duck stash-explain    Explain what is inside your stashes
  duck onboard          Generate ONBOARDING.md based on repo history
  duck preflight        Scan staged code for debug leftovers
  duck deps             Check dependencies for updates and vulnerabilities
  duck clean            Clean up stale and merged local branches
  duck sync-check       Check if local branch is behind origin
  duck changelog        Draft release notes
  duck diff             View the staged git diff
  duck digest           Summarize commits from the past week
  duck force-push       Guarded force-push with backup tag
  duck history-scan     Scan history for committed secrets
  duck timewarp         Backdate staged changes (alias: backdate)
  duck init             (Spoiler: you don't need this)

Try typing any of the commands above!`;

// A component that simulates terminal lines being printed one by one
const TerminalOutput = ({ text, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    const lines = text.split('\n');
    let currentLine = 0;
    
    const interval = setInterval(() => {
      setDisplayed(lines.slice(0, currentLine + 1).join('\n'));
      currentLine++;
      if (currentLine >= lines.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40); // Print one line every 40ms for a smooth terminal effect
    
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <>{displayed}</>;
};

export default function InteractiveTerminal({ onClose }) {
  const [history, setHistory] = useState([
    { type: 'output', text: '🦆 Welcome to the Duck CLI Sandbox! Type "duck /help" to see all available commands.', isTyping: false }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // is the duck thinking or typing?
  const [loadingMsg, setLoadingMsg] = useState('');
  
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isProcessing, input]);

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: 'input', text: trimmedCmd }]);
    setInput('');

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    setIsProcessing(true);
    
    // Determine the response based on the command
    let responseText = '';
    const lowercaseCmd = trimmedCmd.toLowerCase();
    
    // Help command variations
    if (lowercaseCmd === 'help' || lowercaseCmd === 'duck help' || lowercaseCmd === 'duck /help' || lowercaseCmd === 'duck --help') {
      responseText = helpMenu;
    } else {
      // Allow them to type "duck blame-explain src/foo" and we just match the base command
      const baseCommandMatch = Object.keys(mockResponses).find(key => lowercaseCmd.startsWith(key));
      if (baseCommandMatch) {
        responseText = mockResponses[baseCommandMatch];
      } else {
        responseText = `🦆 Command not found in sandbox: ${trimmedCmd}.\nTry "duck /help" to see the list of simulated commands.`;
      }
    }

    // Phase 1: Simulate AI thinking/scanning delay
    setLoadingMsg('Duck is reading your repo...');
    setTimeout(() => {
      setLoadingMsg('');
      // Phase 2: Start typewriter output
      setHistory(prev => [...prev, { type: 'output', text: responseText, isTyping: true }]);
    }, 600);
  };

  const handleTypewriterComplete = (index) => {
    setHistory(prev => {
      const newHist = [...prev];
      if (newHist[index]) {
        newHist[index].isTyping = false;
      }
      return newHist;
    });
    setIsProcessing(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[10005] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8" 
      onClick={onClose}
      data-lenis-prevent="true"
    >
      <div 
        className="w-full max-w-3xl bg-ink border-2 border-border shadow-[0_0_50px_rgba(255,87,26,0.2)] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-10 border-b border-border bg-[#0a0a0a] flex items-center justify-between px-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">duck-sandbox ~ bash</div>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-paper transition-colors duration-200 text-lg leading-none">✕</button>
        </div>

        <div 
          ref={scrollRef}
          className="h-[500px] max-h-[70vh] overflow-y-auto p-4 md:p-6 font-mono text-sm md:text-base cursor-text custom-scrollbar"
          onClick={() => inputRef.current?.focus()}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          data-lenis-prevent="true"
        >
          {history.map((line, i) => (
            <div key={i} className="mb-4 whitespace-pre-wrap">
              {line.type === 'input' ? (
                <div className="flex items-start">
                  <span className="text-red mr-3 shrink-0">❯</span>
                  <span className="text-paper font-bold">{line.text}</span>
                </div>
              ) : (
                <div className="text-[#a1a1aa] pl-4 border-l-2 border-border/50 py-1 leading-[1.6]">
                  {line.isTyping ? (
                    <TerminalOutput text={line.text} onComplete={() => handleTypewriterComplete(i)} />
                  ) : (
                    line.text
                  )}
                </div>
              )}
            </div>
          ))}

          {loadingMsg && (
            <div className="mb-4 pl-4 text-red animate-pulse flex items-center gap-2">
              <span>🦆</span> {loadingMsg}
            </div>
          )}

          {!isProcessing && !loadingMsg && (
            <div className="flex items-center">
              <span className="text-red mr-3 font-bold shrink-0 animate-pulse">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommand(input);
                }}
                className="flex-1 bg-transparent border-none outline-none text-paper focus:ring-0 p-0 m-0 w-full caret-red"
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
