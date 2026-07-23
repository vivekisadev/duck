import React from 'react';

const ProblemSection = () => {
  return (
    <section id="problem" className="p-0 border-none relative bg-transparent">
      {/* Viewport Centered Badge */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full text-center">
        <div className="badge mx-auto justify-center">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
          The problem
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto pt-16 relative border-l border-r border-border">
        <div className="relative overflow-hidden">
          <div className="px-5 md:px-12 pt-8 pb-12 flex flex-col items-center text-center">
            <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] max-w-4xl mb-6">
              Git is incredibly powerful.<br />But it lets you fly completely blind.
            </h2>
            <p className="text-[1.1rem] md:text-[1.25rem] text-[#a1a1aa] leading-[1.6] font-normal max-w-2xl">
              From solo developers to engineering teams, Duck brings absolute safety and clarity to version control in every environment.
            </p>
          </div>

          <div className="border-t border-border"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 min-h-auto md:min-h-[420px]">
            <div className="col-span-1 md:col-span-1 md:row-span-2 border-b md:border-b-0 md:border-r border-border relative flex items-center justify-center overflow-hidden min-h-[280px] md:min-h-auto group">
              <div className="w-[280px] h-[280px] md:w-[380px] md:h-[380px]">
                <svg id="tangled-git" className="w-full h-full" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g className="opacity-20 md:opacity-[0.25] group-hover:opacity-30 transition-opacity duration-300">
                    {/* Grid background */}
                    <path d="M0 80h480 M0 160h480 M0 240h480 M0 320h480 M0 400h480" stroke="#F0EDE6" strokeWidth="0.5" strokeDasharray="2 4"/>
                    <path d="M80 0v480 M160 0v480 M240 0v480 M320 0v480 M400 0v480" stroke="#F0EDE6" strokeWidth="0.5" strokeDasharray="2 4"/>
                    
                    {/* Main branch */}
                    <path d="M80 400 L 160 320 L 240 320 L 320 240 L 400 240" stroke="#F0EDE6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    
                    {/* Branch 1 (broken) */}
                    <path d="M160 320 L 160 160 L 240 80" stroke="#ED462D" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round"/>
                    
                    {/* Branch 2 (tangled) */}
                    <path d="M240 320 L 320 400 L 400 320 L 320 320" stroke="#F0EDE6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    
                    {/* Commits */}
                    <circle cx="80" cy="400" r="8" fill="#000" stroke="#F0EDE6" strokeWidth="3"/>
                    <circle cx="160" cy="320" r="8" fill="#000" stroke="#F0EDE6" strokeWidth="3"/>
                    <circle cx="240" cy="320" r="8" fill="#000" stroke="#F0EDE6" strokeWidth="3"/>
                    <circle cx="320" cy="240" r="8" fill="#000" stroke="#F0EDE6" strokeWidth="3"/>
                    <circle cx="400" cy="240" r="8" fill="#000" stroke="#F0EDE6" strokeWidth="3"/>
                    
                    <circle cx="160" cy="160" r="6" fill="#000" stroke="#ED462D" strokeWidth="2"/>
                    <circle cx="240" cy="80" r="6" fill="#000" stroke="#ED462D" strokeWidth="2"/>
                    
                    <circle cx="320" cy="400" r="6" fill="#000" stroke="#F0EDE6" strokeWidth="2"/>
                    <circle cx="400" cy="320" r="6" fill="#000" stroke="#F0EDE6" strokeWidth="2"/>
                    
                    {/* Detached HEAD marker */}
                    <text x="255" y="75" fill="#ED462D" fontFamily="'JetBrains Mono', monospace" fontSize="12" letterSpacing="0.05em">DETACHED_HEAD</text>
                    
                    {/* Conflict markers */}
                    <path d="M300 290 L340 350 M340 290 L300 350" stroke="#ED462D" strokeWidth="4" strokeLinecap="round" className="animate-[pulse_2s_infinite]"/>
                  </g>
                  
                  <text x="240" y="450" textAnchor="middle" fill="#F0EDE6" opacity="0.6" fontFamily="'JetBrains Mono', monospace" fontSize="8" letterSpacing="0.2em">GIT_STATE_CRITICAL</text>
                </svg>
              </div>
            </div>

            <div className="col-span-1 md:border-r md:border-b border-border p-5 md:p-8 border-b md:border-b-0">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red">
                    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-red">No State Awareness</span>
                </div>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-paper-20">001</span>
              </div>
              <h3 className="font-sans font-bold text-[1.35rem] leading-[1.05] mb-3">Flying blind.</h3>
              <p className="text-paper-dim text-[0.8rem] leading-[1.6]">Git never tells you your full situation at a glance. You have to run 4-5 separate commands just to piece together your branch, stashes, and uncommitted changes.</p>
            </div>

            <div className="col-span-1 border-border p-5 md:p-8 border-b">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red">
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="6" r="3" />
                    <path d="M6 15v-6" />
                    <path d="M9 15l4.5 -4.5" strokeDasharray="3 3"/>
                  </svg>
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-red">Detached HEAD</span>
                </div>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-paper-20">002</span>
              </div>
              <h3 className="font-sans font-bold text-[1.35rem] leading-[1.05] mb-3">Silent traps.</h3>
              <p className="text-paper-dim text-[0.8rem] leading-[1.6]">Checking out a commit silently drops you into a detached HEAD state. Commit here, switch branches, and your work can become permanently lost without warning.</p>
            </div>

            <div className="col-span-1 md:border-r border-border p-5 md:p-8 border-b">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-red">Destructive Commands</span>
                </div>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-paper-20">003</span>
              </div>
              <h3 className="font-sans font-bold text-[1.35rem] leading-[1.05] mb-3">No safety net.</h3>
              <p className="text-paper-dim text-[0.8rem] leading-[1.6]">Commands like `force-push` and `hard reset` can permanently wipe out your work or your team's commits with absolutely no built-in undo.</p>
            </div>

            <div className="col-span-1 border-border p-5 md:p-8">
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red">
                    <path d="M16 3h5v5 M21 3l-7 7" />
                    <path d="M8 3H3v5 M3 3l7 7" />
                    <path d="M16 21h5v-5 M21 21l-7-7" />
                    <path d="M8 21H3v-5 M3 21l7-7" />
                  </svg>
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-red">Merge Conflicts</span>
                </div>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-paper-20">004</span>
              </div>
              <h3 className="font-sans font-bold text-[1.35rem] leading-[1.05] mb-3">The wall of text.</h3>
              <p className="text-paper-dim text-[0.8rem] leading-[1.6]">A multi-file conflict dumps raw `&lt;&lt;&lt;&lt;&lt;&lt;&lt;` markers all over your codebase, with zero explanation of why the two sides diverged in the first place.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
