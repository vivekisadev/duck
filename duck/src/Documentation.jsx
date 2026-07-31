import React, { useState, useEffect } from 'react';
import AnimatedCopyButton from './AnimatedCopyButton';

const docData = [
  {
    id: "config",
    title: "Configuration & API Keys",
    sections: [
      {
        title: "Setting up Groq",
        description: "Duck uses AI to analyze your code. Groq is free and fast.",
        command: 'export DUCK_GROQ_API_KEY="your-api-key"',
        output: null
      },
      {
        title: "The .duckrc File",
        description: "Customize Duck by creating a .duckrc file in your repository.",
        command: '{\n  "provider": "groq",\n  "model": "llama-3.3-70b-versatile",\n  "style": "conventional-commits",\n  "duckPersonality": "neutral"\n}',
        output: null
      }
    ]
  },
  {
    id: "core",
    title: "Core Workflow",
    sections: [
      {
        title: "duck commit",
        description: "Reads your staged changes, scans for secrets, drafts a commit message, and asks clarifying questions.",
        command: "duck commit",
        output: "🦆 Quack! Let's see what you broke today...\n✓ Read staged diff (3 files, 42 lines)\n✓ Scanned for accidentally committed API keys (safe!)\n\n🦆 *waddling over to Groq servers...*\n✓ Drafted commit message!\n\n🦆 Wait, quick question: this removes a null check.\n  Did we handle it somewhere else?\n> yeah, it's validated upstream now\n\n✓ Finalizing message...\n\n┌───────────────────────────────────────────────────┐\n│ fix(auth): remove redundant null check            │\n│ (Now handled upstream in validateInput)           │\n└───────────────────────────────────────────────────┘\n\nCommit? [Y/n/e] y"
      },
      {
        title: "duck diff",
        description: "Quickly view your staged changes in a clean, syntax-highlighted format.",
        command: "duck diff",
        output: null
      }
    ]
  },
  {
    id: "state",
    title: "State Awareness",
    sections: [
      {
        title: "duck radar",
        description: "A persistent dashboard showing your branch, detached HEAD status, and ahead/behind counts.",
        command: "duck radar",
        output: "┌─ Repo State ─────────────────────────────────────────────┐\n│ Branch:       feature/csv-export                         │\n│ HEAD:         attached ✓                                 │\n│ Remote:       2 ahead, 5 behind origin/feature/csv-export│\n│ Staged:       3 files                                    │\n│ Unstaged:     1 file                                     │\n│ Stashes:      2 pending                                  │\n│ Last synced:  3 days ago ⚠                               │\n└──────────────────────────────────────────────────────────┘"
      },
      {
        title: "duck sync-check",
        description: "Compares your local branch against origin and warns you if you are significantly behind.",
        command: "duck sync-check",
        output: "✓ Comparing local branch against origin/main\n\n⚠ Your branch is 23 commits behind origin/main\n  (last synced 4 days ago)\n\n  Recommend pulling before continuing — the longer this\n  gap grows, the harder the eventual merge/rebase gets.\n\nPull now? [Y/n]"
      }
    ]
  },
  {
    id: "guards",
    title: "Destructive Action Guards",
    sections: [
      {
        title: "duck force-push",
        description: "A guarded git push --force. Automatically creates a lightweight recovery tag before overwriting remote history.",
        command: "duck force-push",
        output: "✓ Checking what would be overwritten on origin/feature/export\n\n⚠ This will discard 3 commits currently on the remote branch\n  that aren't in your local history:\n    - a1b2c3d \"wip: trying different csv delimiter\"\n    - 9f8e7d6 \"fix typo\"\n\n  A safety tag will be created first: backup/export-2026-07-15\n  so this can be recovered if needed.\n\nProceed with force-push? [y/N]"
      },
      {
        title: "duck reset",
        description: "A guarded git reset --hard. Creates a recovery tag before discarding local commits.",
        command: "duck reset --hard HEAD~3",
        output: "⚠ This will discard 3 local commits and all uncommitted changes.\n  A recovery tag will be created: backup/before-reset-2026-07-15\n\nProceed? [y/N]"
      }
    ]
  },
  {
    id: "explain",
    title: "Explain & Resolve",
    sections: [
      {
        title: "duck fetch & pull",
        description: "duck fetch provides a plain-English readout of incoming commits.",
        command: "duck fetch",
        output: "✓ Fetching from origin (no local changes made)\n\n  origin/main has 5 new commits you don't have yet\n  Your branch has 2 commits origin doesn't have"
      },
      {
        title: "duck conflict-explain",
        description: "Walks you through merge conflicts file by file, using AI to explain why the two branches diverged.",
        command: "duck resolve",
        output: "✓ Found 4 conflicting files — walking through them one at a time\n\n[1/4] src/utils/format.js\n  Your side changed this to handle null values safely.\n  Their side changed the same function for a new date format.\n  These changes are unrelated — safe to keep both.\n\n  › Keep both (duck will merge them)\n    Show me the raw diff instead\n    Skip for now"
      }
    ]
  },
  {
    id: "security",
    title: "Security & Hygiene",
    sections: [
      {
        title: "duck preflight",
        description: "Scans for console.log, large commented-out blocks, and unresolved TODOs.",
        command: "duck preflight",
        output: "✓ Scanning staged + unstaged changes\n\n┌─ Preflight Warnings ────────────────────────────────────┐\n│ ⚠ src/api/users.js:42 — console.log left in             │\n│ ⚠ src/hooks/useAuth.js:15 — \"TODO: handle expired token\"│\n└──────────────────────────────────────────────────────────┘\n\nPush anyway? [y/N]"
      },
      {
        title: "duck history-scan",
        description: "Scans your entire commit history for accidentally committed secrets.",
        command: "duck history-scan",
        output: "✓ Scanning full commit history for accidentally committed secrets\n\n⚠ Found what looks like an AWS key in commit 7f3a9c1\n  (3 commits ago, in src/config/aws.js)\n\n  Recommended: rotate this key immediately."
      }
    ]
  },
  {
    id: "summarization",
    title: "Summarization",
    sections: [
      {
        title: "duck standup",
        description: "Reads your commits since yesterday and groups them by theme for quick reporting.",
        command: "duck standup",
        output: "✓ Reading commits since yesterday 9:00 AM\n\n┌─ Yesterday ────────────────────────────────────────────┐\n│ • Fixed a race condition in the auth token flow         │\n│ • Started the CSV export feature                        │\n└───────────────────────────────────────────────────────┘\n\nCopy to clipboard? [Y/n] y"
      }
    ]
  },
  {
    id: "architecture",
    title: "Architecture & Scale",
    sections: [
      {
        title: "Multi-Provider Fallback",
        description: "Duck never fails when a free-tier provider runs dry. It automatically rotates from Groq → Cerebras → Gemini → OpenRouter → Mistral so your workflow is never blocked.",
        command: "duck commit",
        output: "🦆 Quack! Let's see what you broke today...\n✓ Read staged diff (2 files, 45 lines)\n\n🦆 *waddling to Groq servers...*\n⚠ Wait, Groq is taking a nap (Rate Limit). Waddling over to Cerebras...\n\n✓ Drafted commit message!\n\n┌─────────────────────────────────────────────────────────┐\n│ fix(core): implement automatic multi-provider fallback  │\n└─────────────────────────────────────────────────────────┘"
      },
      {
        title: "Relay Backend & Key Fallback",
        description: "The CLI talks to a secure, single endpoint. Your API keys are never shipped in the npm package. If the global pool is ever exhausted, Duck will politely ask for your personal key so you can keep flying.",
        command: "duck commit",
        output: "🦆 Oh no, the flock is out of free tokens today! (Pool exhausted)\n\n  You can add your own free API key (Groq, Gemini, etc.) to keep \n  duck flying at full speed. It takes 2 minutes and no card is needed!\n\n  Add a key now? [Y/n]\n> y\n  Paste your key: ********************\n\n✓ Quack-tastic! Saved. Using your key for future requests."
      }
    ]
  }
];

export default function Documentation({ SectionSeparator }) {
  const [activeSection, setActiveSection] = useState(docData[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.doc-section');
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      if (current) setActiveSection(current);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative z-10 pt-24 pb-24 text-paper min-h-screen">
      <div className="max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col md:flex-row gap-12 relative">
        
        {/* Sidebar Navigation */}
        <div className="md:w-[250px] shrink-0">
          <div className="sticky top-24">
            <h3 className="font-sans text-xl font-bold mb-6 text-paper">Documentation</h3>
            <ul className="flex flex-col gap-3">
              {docData.map(group => (
                <li key={group.id}>
                  <button
                    onClick={() => scrollTo(group.id)}
                    className={`text-left text-[0.95rem] transition-colors font-sans w-full
                      ${activeSection === group.id ? 'text-red font-medium' : 'text-paper-dim hover:text-paper'}`}
                  >
                    {group.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-[800px]">
          <h1 className="font-sans text-[clamp(2.5rem,5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] mb-4">
            Duck CLI Docs
          </h1>
          <p className="text-paper-dim text-lg leading-[1.6] mb-16">
            Explore the full suite of commands, how to configure Duck, and see exactly what it does to keep your Git workflow safe.
          </p>

          {docData.map(group => (
            <div key={group.id} id={group.id} className="doc-section mb-20">
              <h2 className="font-sans text-2xl md:text-3xl font-bold mb-8 text-paper pb-4 border-b border-border">
                {group.title}
              </h2>
              
              <div className="flex flex-col gap-12">
                {group.sections.map((sec, idx) => (
                  <div key={idx}>
                    <h3 className="font-mono text-xl text-red mb-3 tracking-tight font-medium">
                      {sec.title}
                    </h3>
                    <p className="text-paper-dim mb-6 leading-[1.6]">
                      {sec.description}
                    </p>
                    
                    {/* Terminal Card */}
                    <div className="border border-border bg-ink rounded-lg overflow-hidden relative shadow-[0_0_15px_rgba(255,87,26,0.05)]">
                      <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-paper/5">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <AnimatedCopyButton textToCopy={sec.command} size="sm" />
                      </div>
                      <div className="p-5 font-mono text-[0.85rem] text-paper-dim whitespace-pre-wrap overflow-x-auto leading-[1.6]">
                        <div className="flex gap-3 mb-4">
                          <span className="text-red select-none">$</span>
                          <span className="text-paper">{sec.command}</span>
                        </div>
                        {sec.output && (
                          <div className="text-paper-dim">
                            {sec.output}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
