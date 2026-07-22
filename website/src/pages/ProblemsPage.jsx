import React from 'react';
import SimulationTerminal from '../components/SimulationTerminal';

const ProblemsPage = () => {
  const problems = [
    {
      id: "001",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M6 15v-6" />
          <path d="M9 15l4.5 -4.5" strokeDasharray="3 3"/>
        </svg>
      ),
      tag: "The Detached HEAD Trap",
      title: "Silent traps.",
      problem: "Checking out a commit directly silently puts you in detached HEAD. If you commit here and switch branches, those commits can become permanently lost — and Git gives no warning.",
      socialProof: {
        source: "StackOverflow",
        author: "user_4912",
        text: "I checked out an old commit to test something, made 4 new commits, and then typed `git checkout main`. All my new commits just vanished instantly. Where did they go? Git didn't say anything...",
        metrics: "18,492 upvotes"
      },
      gitCommand: "git checkout 9f8e7d6",
      gitOutput: "Note: switching to '9f8e7d6'.\n\nYou are in 'detached HEAD' state. You can look around, make experimental\nchanges and commit them, and you can discard any commits you make in this\nstate without impacting any branches by switching back to a branch.\n\nHEAD is now at 9f8e7d6 fix: typo in login",
      duckCommand: "duck goto 9f8e7d6",
      duckOutput: "⚠ WARNING: Checking out this commit will put you in Detached HEAD.\n\n  Any commits you make here will not belong to a branch and could be lost.\n\n  Would you like Duck to automatically create a temporary branch for you? [Y/n]\n> y\n\n✓ Created and switched to branch 'experiment/9f8e7d6'. You are safe to commit.",
      solutionTitle: "duck goto",
      solution: "Acts as a safe checkout wrapper. It explicitly warns you before entering detached HEAD and gives you the option to create a branch first. If you do commit while detached, the pre-commit hook warns you to save your work."
    },
    {
      id: "002",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      tag: "Destructive Rewriting",
      title: "No safety net.",
      problem: "Commands like `git push --force` and `git reset --hard` can permanently wipe commits — teammates' work, your own uncommitted progress, or an entire branch — with no built-in undo.",
      socialProof: {
        source: "Twitter",
        author: "@dev_pain",
        text: "Just accidentally ran `git push --force` on the main branch instead of my feature branch. Overwrote 3 days of work from 4 different teammates. Why does git let me do this so easily 😭",
        metrics: "4,201 Retweets"
      },
      gitCommand: "git push origin main --force",
      gitOutput: "Total 0 (delta 0), reused 0 (delta 0), pack-reused 0\nTo github.com:company/repo.git\n + d8f91a2...9f8e7d6 main -> main (forced update)",
      duckCommand: "duck force-push origin main",
      duckOutput: "⚠ DANGER: This will discard 14 commits currently on origin/main.\n\n  Are you absolutely sure you want to overwrite the remote branch?\n  (A recovery tag 'backup/main-2026-07-22' will be created just in case).\n\nProceed? [y/N]\n> N\n\n✓ Aborted. The remote branch was left untouched.",
      solutionTitle: "duck force-push & duck reset",
      solution: "Automatically creates a lightweight recovery tag before running the destructive operation. An \"undo\" always exists, and you see exactly whose commits are about to be lost before it happens."
    },
    {
      id: "003",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 3L14 10M21 3L16 3M21 3L21 8" />
          <path d="M3 21L10 14M3 21L8 21M3 21L3 16" />
        </svg>
      ),
      tag: "Fetch vs. Pull Confusion",
      title: "Blind merges.",
      problem: "`git fetch` updates silently, while `git pull` fetches and merges immediately. Developers often can't tell what `pull` is about to do to their local commits until the merge is already happening.",
      socialProof: {
        source: "Reddit (r/programming)",
        author: "LostInRebase",
        text: "I did a `git pull` and suddenly my editor is filled with conflict markers across 12 files. I didn't even know what I was pulling down. Now I'm stuck in a merge I didn't want.",
        metrics: "842 points"
      },
      gitCommand: "git pull origin feature/payment",
      gitOutput: "remote: Enumerating objects: 34, done.\nremote: Counting objects: 100% (34/34), done.\nUnpacking objects: 100% (34/34), done.\nAuto-merging src/api/stripe.js\nCONFLICT (content): Merge conflict in src/api/stripe.js\nAutomatic merge failed; fix conflicts and then commit the result.",
      duckCommand: "duck pull origin feature/payment",
      duckOutput: "✓ Fetched origin/feature/payment\n\n  This branch has 3 new commits by @alice:\n    - add stripe webhook handler\n    - fix billing edge case\n    - update types\n\n⚠ WARNING: Pulling this will cause a merge conflict in `src/api/stripe.js`.\n\n  Would you like to proceed and resolve conflicts now? [y/N]\n> n\n\n✓ Aborted. Your local files were not touched.",
      solutionTitle: "duck fetch & duck pull",
      solution: "Provides a plain-English readout of incoming commits without changing files. Duck explicitly states which merge strategy it will use and warns of conflicts before running."
    },
    {
      id: "004",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 3h5v5 M21 3l-7 7" />
          <path d="M8 3H3v5 M3 3l7 7" />
          <path d="M16 21h5v-5 M21 21l-7-7" />
          <path d="M8 21H3v-5 M3 21l7-7" />
        </svg>
      ),
      tag: "Overwhelming Conflicts",
      title: "The wall of text.",
      problem: "A multi-file conflict dumps raw `<<<<<<<` markers all over your codebase at once, with zero explanation of why the two sides diverged in the first place.",
      socialProof: {
        source: "GitHub Issues",
        author: "frontend_dev",
        text: "Is there any tool that explains *why* a conflict happened? I just see 'HEAD' and 'origin/feature' with 50 lines of different code, and I don't remember writing either of them.",
        metrics: "Closed as 'not planned'"
      },
      gitCommand: "git merge feature/new-ui",
      gitOutput: "<<<<<<< HEAD\nconst user = await db.getUser(req.userId);\n=======\nconst user = await auth.verifyToken(req.headers.authorization);\n>>>>>>> feature/new-ui",
      duckCommand: "duck resolve",
      duckOutput: "✓ Found 2 conflicting files — walking through them sequentially.\n\n[1/2] src/auth.js\n  Your side (HEAD) changed the database call to use req.userId.\n  Their side (feature/new-ui) replaced the db call entirely with JWT auth.\n\n  Since JWT auth is the new standard, you likely want to accept their change.\n\n  › Accept their change (JWT auth)\n    Keep your change (req.userId)\n    Keep both\n    Show raw diff",
      solutionTitle: "duck resolve",
      solution: "Walks you through conflicts one file at a time. It uses local or cloud AI to explain why the divergence happened, turning an intimidating wall of text into digestible, sequential choices."
    },
    {
      id: "005",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
      tag: "Committing Secrets",
      title: "Accidental exposure.",
      problem: "A missing `.gitignore` means secrets, .env files, or build folders get tracked and pushed before anyone notices — sometimes exposing them permanently.",
      socialProof: {
        source: "HackerNews",
        author: "sec_ops",
        text: "AWS bills someone $50k overnight because a junior dev accidentally committed their `.env` file to a public repo. We really need a way to stop this *before* it leaves the local machine.",
        metrics: "1.2k comments"
      },
      gitCommand: "git commit -m \"added aws integration\"",
      gitOutput: "[feature/aws c7f9e1d] added aws integration\n 2 files changed, 45 insertions(+)\n create mode 100644 .env",
      duckCommand: "duck commit",
      duckOutput: "✓ Reading staged diff...\n\n⚠ CRITICAL ERROR: Found potential secrets in staged files!\n\n  File: .env\n  Matches pattern: AWS_ACCESS_KEY_ID\n\n  Duck has blocked this commit. Please remove the secret or add the file to .gitignore.\n\nCommit aborted.",
      solutionTitle: "duck ignore-audit",
      solution: "Proactively catches bad files before the first commit. If a mistake already happened, `duck history-scan` finds secrets in your history and safely walks you through rotating keys and rewriting history."
    },
    {
      id: "006",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20v-6M6 20V10M18 20V4" />
        </svg>
      ),
      tag: "Accidental Commits to Main",
      title: "Wrong branch panic.",
      problem: "Working for hours before realizing you've been committing directly to `main` instead of checking out a feature branch. Moving those commits gracefully is notoriously difficult for beginners.",
      socialProof: {
        source: "StackOverflow",
        author: "junior_dev_99",
        text: "I just made 5 commits to main locally instead of checking out a new branch for my feature. How do I move them to a new branch without losing my work? Everything I google mentions `git reset --hard` and that sounds terrifying.",
        metrics: "12,192 upvotes"
      },
      gitCommand: "git reset --hard origin/main\ngit checkout -b feature/new-stuff\n# (Wait, this deletes the commits entirely if you didn't branch first!)",
      gitOutput: "HEAD is now at origin/main\nSwitched to a new branch 'feature/new-stuff'\n# All 5 local commits are now permanently lost and unrecoverable.",
      duckCommand: "duck branch-move feature/new-stuff",
      duckOutput: "✓ Identified 5 local commits ahead of origin/main.\n\n  This will:\n  1. Create a new branch 'feature/new-stuff' with your 5 commits.\n  2. Safely reset 'main' back to match origin/main.\n\nProceed? [Y/n]\n> y\n\n✓ Success! You are now on 'feature/new-stuff' with your work intact.\n✓ 'main' has been safely reset.",
      solutionTitle: "duck branch-move",
      solution: "Intelligently identifies local commits that haven't been pushed, creates a new branch holding those commits, and safely resets the previous branch back to its remote state in one seamless, guaranteed-safe action."
    },
    {
      id: "007",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
      tag: "Stash Amnesia",
      title: "Popping into disaster.",
      problem: "Running `git stash pop` completely blind, only to get hit with massive merge conflicts that instantly break your working directory. Worse, a conflicting pop doesn't drop the stash, leaving you in a halfway state.",
      socialProof: {
        source: "Reddit (r/webdev)",
        author: "code_monkey",
        text: "I popped a stash from 3 weeks ago and it conflicted with EVERYTHING in my working directory. I tried to abort but `git merge --abort` doesn't work for stashes. My working tree is completely destroyed.",
        metrics: "342 points"
      },
      gitCommand: "git stash pop",
      gitOutput: "Auto-merging src/App.jsx\nCONFLICT (content): Merge conflict in src/App.jsx\nAuto-merging src/styles.css\nCONFLICT (content): Merge conflict in src/styles.css\nThe stash entry is kept in case you need it again.",
      duckCommand: "duck stash-pop",
      duckOutput: "✓ Simulating pop for stash@{0} (WIP on feature/auth)...\n\n⚠ WARNING: Popping this stash will cause 2 merge conflicts:\n  - src/App.jsx\n  - src/styles.css\n\n  Would you like to:\n  › View the diff of the stash before popping\n    Pop anyway and resolve conflicts\n    Cancel and keep working tree clean",
      solutionTitle: "duck stash-pop",
      solution: "Performs a dry-run of the stash pop first. It warns you of any conflicts before touching your working files, and allows you to easily view a clean diff of what the stash actually contains before you apply it."
    },
    {
      id: "008",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      ),
      tag: "Large File Bloat",
      title: "Accidental history bloat.",
      problem: "Committing a massive 500MB database dump or video file, which permanently bloats the `.git` folder. GitHub rejects the push, but a simple `git rm` doesn't remove it from the Git history.",
      socialProof: {
        source: "Twitter",
        author: "@data_scientist",
        text: "I accidentally committed a 1GB `.sqlite` file. GitHub rejected the push because it's too big, so I deleted the file and committed again. GitHub STILL rejects it because the 1GB file is in my local history. I am trapped.",
        metrics: "1,290 Retweets"
      },
      gitCommand: "git push origin main",
      gitOutput: "remote: error: GH001: Large files detected. You may want to try Git Large File Storage.\nremote: error: File data.sqlite is 1024.00 MB; this exceeds GitHub's file size limit of 100.00 MB\nTo github.com:company/repo.git\n ! [remote rejected] main -> main (pre-receive hook declined)",
      duckCommand: "duck commit",
      duckOutput: "✓ Reading staged diff...\n\n⚠ CRITICAL ERROR: You are attempting to commit a file larger than 50MB.\n  File: data.sqlite (1.02 GB)\n\n  Large files will be rejected by GitHub and permanently bloat your repository history.\n\n  Would you like Duck to:\n  › Remove it from staging and add to .gitignore\n    Set it up with Git LFS (Large File Storage)\n    Abort commit",
      solutionTitle: "duck preflight",
      solution: "Automatically checks file sizes before the commit is finalized. It blocks files over a configurable threshold and offers to instantly add them to `.gitignore` or configure them with Git LFS."
    },
    {
      id: "009",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      tag: "Lost History & Backdating",
      title: "The single-day dump.",
      problem: "You started a project months ago, but only decided to push it to GitHub today. If you just initialize and commit now, your contribution graph will show all your hard work crammed into a single day, ignoring months of actual progress.",
      socialProof: {
        source: "Reddit (r/github)",
        author: "SideProjectHustler",
        text: "I've been working locally on my startup for 6 months without git. I finally pushed to GitHub today, but now my commit graph just shows 1 massive green square for today. Is there any way to space my commits back out so my history shows my actual 6 months of hard work?",
        metrics: "1,104 upvotes"
      },
      gitCommand: "git commit -m 'Initial commit of 6 months work'",
      gitOutput: "[main (root-commit) b3c9a1] Initial commit of 6 months work\n 314 files changed, 14,291 insertions(+)\n\n# Your GitHub graph now shows 1 commit today and 0 for the past 6 months.",
      duckCommand: "duck timewarp --range 2025-06-01:2025-12-01 --commits 142 --distribution even",
      duckOutput: "✓ Analyzed 314 files and 14,291 lines of code.\n\n  Duck will logically chunk this massive initial commit into \n  smaller commits distributed across the last 6 months to\n  accurately reflect your time spent building this.\n\nProceed to backdate commits? [Y/n]\n> y\n\n✓ Successfully generated 142 commits spaced evenly over the 6 month range.",
      solutionTitle: "duck timewarp",
      solution: "Allows you to select a time range and frequency to logically distribute a massive dump of local work into realistic, chronological commits. It retroactively populates your contribution graph to perfectly reflect the time you spent building projects you forgot to track earlier."
    }
  ];

  return (
    <div className="w-full relative z-10 pt-24 pb-24 min-h-screen flex justify-center">
      {/* Changed to max-w-4xl and removed the grid layout for a single-column reading experience */}
      <div className="w-full max-w-4xl mx-auto px-5 md:px-12 relative border-l border-r border-border">
        
        {/* Viewport Centered Badge */}
        <div className="w-full text-center mb-8">
          <div className="badge mx-auto justify-center">
            <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
            The 9 Major Pain Points
          </div>
        </div>

        <div className="relative overflow-hidden border-t border-border mt-8">
          <div className="pt-8 pb-12 flex flex-col items-center text-center">
            <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] mb-6">
              Git's worst traps.<br />And how Duck solves them.
            </h2>
            <p className="text-[1.1rem] md:text-[1.25rem] text-[#a1a1aa] leading-[1.6] font-normal max-w-2xl">
              We cataloged the most common Git frustrations from thousands of developers. Here is exactly how Duck intercepts and prevents them.
            </p>
          </div>

          <div className="border-t border-border"></div>

          {/* New Layout: Single Centered Column */}
          <div className="flex flex-col relative">
            
            {/* Problem List */}
            {problems.map((item, index) => (
              <div key={item.id} className={`py-12 md:py-16 ${index !== problems.length - 1 ? 'border-b border-border' : ''}`}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="text-red">
                      {item.icon}
                    </div>
                    <span className="font-mono text-[0.7rem] md:text-[0.8rem] tracking-[0.1em] uppercase text-red font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <span className="font-mono text-[0.7rem] tracking-[0.2em] text-paper-20">
                    {item.id}
                  </span>
                </div>
                
                {/* Problem Description */}
                <div className="mb-8">
                  <h3 className="font-sans font-bold text-3xl md:text-4xl leading-[1.1] mb-6 text-paper tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-paper-dim text-lg leading-[1.7]">
                    {item.problem}
                  </p>
                </div>
                
                {/* Social Proof (The Real Pain) */}
                <div className="bg-paper/5 border border-border rounded-lg p-6 mb-10 relative">
                  <div className="flex items-center gap-2 mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-paper-dim">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4l3 3"></path>
                    </svg>
                    <span className="text-[0.8rem] font-mono text-paper-dim">Real World Impact — {item.socialProof.source}</span>
                  </div>
                  <p className="text-paper italic text-lg md:text-[1.15rem] leading-[1.7] mb-4">"{item.socialProof.text}"</p>
                  <div className="flex justify-between items-center text-sm font-mono text-paper-dim">
                    <span>{item.socialProof.author}</span>
                    <span>{item.socialProof.metrics}</span>
                  </div>
                </div>
                
                {/* Solution Block */}
                <div className="bg-red/5 border border-red/20 rounded-lg p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red"></div>
                  <div className="flex flex-col">
                    <h4 className="text-red font-mono text-sm mb-4 font-medium tracking-wide flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      HOW DUCK SOLVES IT
                    </h4>
                    <p className="text-paper-dim text-lg leading-[1.7]">
                      <strong className="text-paper font-medium">{item.solutionTitle}: </strong>
                      {item.solution}
                    </p>
                    
                    {/* Terminal Simulation Toggle */}
                    <div className="mt-8">
                      <SimulationTerminal 
                        gitCommand={item.gitCommand}
                        gitOutput={item.gitOutput}
                        duckCommand={item.duckCommand}
                        duckOutput={item.duckOutput}
                      />
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
