import React from 'react';

const OfflineGlobeSection = () => {
  return (
    <section className="bg-transparent relative overflow-hidden">
      
      {/* Main boundary wrapper to keep content inside the lines */}
      <div className="w-full max-w-[1200px] mx-auto relative border-l border-r border-b border-border min-h-[560px] py-16 md:py-24 z-10 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_50%)]">
        
        {/* Centered Text Content */}
        <div className="flex flex-col items-center text-center max-w-[600px] px-5 mb-16 relative z-20">
          <div className="badge mb-8 mx-auto justify-center">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
            Offline By Default
          </div>
          <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] mb-4 text-center">Always Secure.</h2>
          <p className="text-paper-dim text-base leading-[1.6]">No telemetry. No accounts. No cloud dependencies. Duck CLI runs strictly on your local machine.</p>
        </div>

        {/* Centered Premium Network Visualization */}
        <div className="w-full relative flex items-center justify-center px-5">
          <div className="w-full max-w-[400px] flex flex-col items-center gap-6 relative z-10">
            
            {/* Cloud Node (Disconnected) */}
            <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                </svg>
              </div>
              <span className="text-[0.65rem] font-mono tracking-widest uppercase text-paper-dim">Cloud</span>
            </div>

            {/* Severed Connection Line */}
            <div className="h-12 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent relative flex items-center justify-center -my-1">
               {/* Red X */}
               <div className="w-6 h-6 rounded-full bg-red/10 border border-red/30 flex items-center justify-center backdrop-blur-md z-10 animate-[pulse-red_3s_infinite]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
               </div>
            </div>

            {/* Local Machine Node */}
            <div className="w-full bg-[#0c0c0c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-paper font-semibold text-sm">Localhost</h4>
                    <p className="text-[0.65rem] font-mono tracking-wider text-green-500 uppercase mt-0.5 flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span> Secure
                    </p>
                  </div>
                </div>
                <div className="text-[0.6rem] font-mono text-paper-dim bg-white/5 px-2 py-1 rounded">127.0.0.1</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex flex-col gap-1">
                   <span className="text-[0.55rem] uppercase tracking-widest text-paper-dim">Telemetry</span>
                   <span className="text-xs text-paper font-mono">0 bytes</span>
                 </div>
                 <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 flex flex-col gap-1">
                   <span className="text-[0.55rem] uppercase tracking-widest text-paper-dim">Processing</span>
                   <span className="text-xs text-paper font-mono flex items-center gap-1.5">
                     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Native
                   </span>
                 </div>
              </div>
            </div>

          </div>
          
          {/* Minimal Grid Background restricted to visualization area */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="offline-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#offline-grid)" />
          </svg>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 51, 51, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(255, 51, 51, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 51, 51, 0); }
        }
      `}} />
    </section>
  );
};

export default OfflineGlobeSection;
