import React from 'react';

const PremiumMiniTerminal = ({ children }) => (
  <div className="mt-8 bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden font-mono text-[0.6rem] relative shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col h-[110px] group flex-1">
    <div className="flex px-3 py-2 bg-white/[0.02] border-b border-white/5 items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#ff5f56] transition-colors"></div>
      <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#ffbd2e] transition-colors"></div>
      <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#27c93f] transition-colors"></div>
    </div>
    <div className="p-3 relative flex-1 text-paper-dim/80">
      {children}
    </div>
  </div>
);

const ThreeColDetailsSection = () => {
  return (
    <section className="p-0 bg-transparent">
      <div className="w-full max-w-[1200px] mx-auto relative border-l border-r border-border">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Card 1: Open Source (Top Left) */}
          <div className="p-8 md:p-12 relative group h-full flex flex-col border-b md:border-r border-border">
            <div className="flex-1 transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:-translate-y-2 flex flex-col">
              <div className="badge mb-8 mx-auto md:mx-0 justify-center md:justify-start group-hover:bg-red/10 transition-colors">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
                Open Source
              </div>
              <h3 className="font-sans font-bold text-2xl leading-[1.05] tracking-[-0.02em] mb-4 text-center md:text-left">Transparent Code</h3>
              <p className="text-paper-dim text-[0.85rem] leading-[1.6] text-center md:text-left">Inspect the logic yourself. Duck CLI is fully open source and built in public. No hidden telemetry.</p>
              
              <PremiumMiniTerminal>
                <div className="mb-1 text-paper flex gap-2">
                  <span className="text-red">❯</span> cat src/core.rs
                </div>
                <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-700">
                  <span className="text-blue-400">pub fn</span> <span className="text-yellow-200">execute</span>() {'{'} <br/>
                  &nbsp;&nbsp;<span className="text-green-500">// 100% local processing</span><br/>
                  &nbsp;&nbsp;git::run_native();<br/>
                  {'}'}
                </div>
              </PremiumMiniTerminal>
            </div>
          </div>

          {/* Card 2: Zero Config (Top Right) */}
          <div className="p-8 md:p-12 relative group h-full flex flex-col border-b border-border">
            <div className="flex-1 transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:-translate-y-2 flex flex-col">
              <div className="badge mb-8 mx-auto md:mx-0 justify-center md:justify-start group-hover:bg-red/10 transition-colors">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
                Zero Config
              </div>
              <h3 className="font-sans font-bold text-2xl leading-[1.05] tracking-[-0.02em] mb-4 text-center md:text-left">Instantly Useful</h3>
              <p className="text-paper-dim text-[0.85rem] leading-[1.6] text-center md:text-left">Just run `duck install` and it aliases `git` automatically. No complex setup or new commands to learn.</p>
              
              <PremiumMiniTerminal>
                <div className="flex gap-2 mb-2 text-paper">
                  <span className="text-red">❯</span> duck install
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Installed and aliased
                  </div>
                  <div className="text-paper/50 italic mt-1">Ready to use.</div>
                </div>
              </PremiumMiniTerminal>
            </div>
          </div>

          {/* Card 3: Safety First (Bottom Full Width) */}
          <div className="p-8 md:p-12 relative group h-full flex flex-col md:flex-row md:items-center gap-8 md:col-span-2">
            
            <div className="flex-1 transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:-translate-x-2">
              <div className="badge mb-6 mx-auto md:mx-0 justify-center md:justify-start group-hover:bg-red/10 transition-colors">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
                Safety First
              </div>
              <h3 className="font-sans font-bold text-3xl leading-[1.05] tracking-[-0.02em] mb-4 text-center md:text-left">Never Lose Work</h3>
              <p className="text-paper-dim text-[0.95rem] leading-[1.6] opacity-80 text-center md:text-left max-w-[500px]">Automatic backup tags ensure you can always recover from a bad rebase, hard reset, or force push. Duck CLI intercepts destructive commands and saves your state before executing them.</p>
            </div>
            
            <div className="flex-[1.5] transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:translate-x-2 w-full max-w-[600px] mx-auto">
              <PremiumMiniTerminal>
                <div className="flex gap-2 mb-2 text-paper">
                  <span className="text-red">❯</span> duck undo
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">⟲</span> Restoring from tag...
                  </div>
                  <div className="text-paper/50 italic mt-1">HEAD is now at safe-point</div>
                </div>
              </PremiumMiniTerminal>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ThreeColDetailsSection;
