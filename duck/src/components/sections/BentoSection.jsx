import React, { useEffect, useRef } from 'react';

const BentoSection = () => {
  const sectionRef = useRef(null);

  return (
    <section className="bg-transparent relative overflow-hidden py-16 md:py-24" ref={sectionRef}>
      
      {/* Top centered badge */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full text-center">
        <div className="badge mx-auto justify-center">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
          Advantage
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-16 md:pt-20">
        <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] text-center mb-16">
          Everything You Need To<br />Work Without Fear
        </h2>
        
        <div className="border border-border grid grid-cols-1 md:grid-cols-2 bg-[#050505]">
          
          {/* Tile 1: Zero Data Loss */}
          <div className="p-8 md:p-12 border-b md:border-b md:border-r border-border flex flex-col min-h-[400px]">
            <h3 className="font-mono text-xl md:text-2xl mb-4 text-paper">Zero Data Loss</h3>
            <p className="text-paper-dim text-sm md:text-base mb-8 max-w-[400px]">
              Every destructive command triggers an instant, lightweight backup tag before executing. You always have an undo button.
            </p>
            
            <div className="mt-auto w-full aspect-[2/1] relative flex items-end">
              {/* Giant abstract percentage/stat like the image, but tailored */}
              <div className="absolute inset-0 bg-gradient-to-t from-red/20 to-transparent flex flex-col items-center justify-center border border-red/20">
                <div className="font-sans font-bold text-5xl md:text-6xl text-paper tracking-tight drop-shadow-md">
                  100<span className="text-3xl">%</span>
                </div>
                <div className="font-mono text-paper-dim uppercase tracking-widest text-xs mt-2">Recovery Rate</div>
              </div>
            </div>
          </div>
          
          {/* Tile 2: Pre-Commit Audits */}
          <div className="p-8 md:p-12 border-b border-border flex flex-col min-h-[400px]">
            <h3 className="font-mono text-xl md:text-2xl mb-4 text-paper">Never Leak Secrets</h3>
            <p className="text-paper-dim text-sm md:text-base mb-8 max-w-[400px]">
              Regex-based scanning prevents you from accidentally committing `.env` files or hardcoded API keys.
            </p>
            
            {/* Simulation */}
            <div className="mt-auto bg-ink border border-red/30 rounded p-5 font-mono text-xs overflow-hidden relative shadow-[0_0_20px_rgba(255,87,26,0.1)]">
              <div className="absolute inset-0 bg-red/5"></div>
              <div className="relative z-10 text-paper-dim mb-3">Scanning staged files...</div>
              <div className="relative z-10 text-paper mb-2 flex justify-between">
                <span>src/main.js</span>
                <span className="text-green-500">PASS</span>
              </div>
              <div className="relative z-10 text-paper mb-2 flex justify-between">
                <span>src/auth.js</span>
                <span className="text-green-500">PASS</span>
              </div>
              <div className="relative z-10 text-red mb-2 flex justify-between font-bold">
                <span>.env</span>
                <span>FAIL</span>
              </div>
              <div className="relative z-10 text-red font-bold mt-4 pt-3 border-t border-red/20">
                [BLOCKED] AWS_ACCESS_KEY_ID found in .env
              </div>
            </div>
          </div>

          {/* Tile 3: Detached HEAD Guard */}
          <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-border flex flex-col min-h-[400px]">
            <h3 className="font-mono text-xl md:text-2xl mb-4 text-paper">Safe Exploration</h3>
            <p className="text-paper-dim text-sm md:text-base mb-8 max-w-[400px]">
              Checking out a commit creates a temporary safety branch. Experiment freely without ever losing your commits to the void.
            </p>
            
            {/* Simulation - Diagram similar to image top right */}
            <div className="mt-auto aspect-[2/1] w-full border border-border bg-ink p-4 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
              
              <div className="w-full flex items-center justify-between text-[0.6rem] md:text-xs font-mono relative z-10 px-4">
                <div className="flex flex-col items-center gap-2 opacity-40">
                  <div className="px-3 py-1.5 border border-border rounded bg-ink">HEAD</div>
                  <div className="h-4 border-l border-dashed border-border"></div>
                  <div className="text-red line-through">detached</div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-[80px] border-t border-dashed border-border relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-border rotate-45"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="px-3 py-1.5 border border-green-500/30 rounded bg-green-500/10 text-green-500">HEAD</div>
                  <div className="h-4 border-l border-dashed border-green-500/50"></div>
                  <div className="bg-green-500 text-ink px-2 py-0.5 font-bold">duck-safe-12b</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tile 4: Native Speed */}
          <div className="p-8 md:p-12 flex flex-col min-h-[400px]">
            <h3 className="font-mono text-xl md:text-2xl mb-4 text-paper">Native Execution Speed</h3>
            <p className="text-paper-dim text-sm md:text-base mb-8 max-w-[400px]">
              Built for zero friction. Duck CLI runs exactly as fast as Git. The safety interception layer adds negligible overhead.
            </p>
            
            {/* Chart matching the bottom right of the image */}
            <div className="mt-auto w-full">
              <div className="font-mono text-xl md:text-2xl text-red mb-6">&lt; 10ms <span className="text-sm text-paper-dim uppercase tracking-widest">overhead</span></div>
              
              <div className="flex flex-col gap-4 border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 font-mono text-[0.65rem] text-paper-dim uppercase">Duck CLI</div>
                  <div className="flex-1 h-1.5 bg-border relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-red"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 font-mono text-[0.65rem] text-paper-dim uppercase">Standard Git</div>
                  <div className="flex-1 h-1.5 bg-border relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[95%] bg-border"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 font-mono text-[0.65rem] text-paper-dim uppercase">Other Wrappers</div>
                  <div className="flex-1 h-1.5 bg-border relative">
                    <div className="absolute left-0 top-0 bottom-0 w-[60%] bg-paper-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BentoSection;
