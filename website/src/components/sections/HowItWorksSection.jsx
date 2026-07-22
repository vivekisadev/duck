import React, { useState, useRef, useEffect, useMemo } from 'react';

// --- Shared Premium Terminal Component ---
const PremiumTerminal = ({ children, delay = 0 }) => {
  return (
    <div className={`w-full max-w-[450px] bg-[#0c0c0c]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-[fade-in_1s_ease-out_forwards]`} style={{ animationDelay: `${delay}ms` }}>
      <div className="bg-white/[0.03] px-4 py-3 flex items-center gap-2 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
      </div>
      <div className="p-5 font-mono text-xs md:text-[0.8rem] leading-relaxed text-paper-dim/80">
        {children}
      </div>
    </div>
  );
};

// --- Step 1 Visualization: The Interceptor ---
const InterceptorVisual = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,rgba(255,51,51,0.05)_0%,transparent_70%)]">
      <PremiumTerminal>
        <div className="flex gap-3 mb-3">
          <span className="text-red">❯</span>
          <span className="text-paper inline-block overflow-hidden whitespace-nowrap animate-[typing_1.5s_steps(20,end)_forwards]">duck push --force</span>
        </div>
        <div className="opacity-0 animate-[fade-in_0.5s_ease-out_forwards_1.5s]">
          <div className="text-yellow-500 mb-2 flex gap-2">
            <span>⚠</span> <span>Warning: Destructive action detected</span>
          </div>
          <div className="text-green-500 mb-4 flex gap-2">
            <span>✓</span> <span>Safety backup created: safe-point-8f2a</span>
          </div>
          <div className="text-paper flex gap-2">
            <span className="text-red">?</span> <span>Proceed with force push? [y/N]</span>
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </PremiumTerminal>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes typing { from { width: 0 } to { width: 100% } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
};

// --- Step 2 Visualization: Context Engine ---
const ContextVisual = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]">
      
      <div className="w-full max-w-[380px] bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)] animate-[fade-in_1s_ease-out_forwards]">
         <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h4 className="text-paper font-medium text-lg tracking-wide flex items-center gap-2">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red">
                 <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
               </svg>
               Duck Radar
            </h4>
            <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active
            </span>
         </div>
         
         <div className="space-y-4">
            <div className="flex justify-between items-center group">
               <span className="text-paper-dim text-sm transition-colors group-hover:text-paper">Unstaged Changes</span>
               <span className="text-paper text-sm font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5">4 files</span>
            </div>
            <div className="flex justify-between items-center group">
               <span className="text-paper-dim text-sm transition-colors group-hover:text-paper">Ahead of Origin</span>
               <span className="text-green-500 text-sm font-mono bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">2 commits</span>
            </div>
            <div className="flex justify-between items-center group">
               <span className="text-paper-dim text-sm transition-colors group-hover:text-paper">Current Status</span>
               <span className="text-red text-sm font-mono bg-red/10 px-2.5 py-1 rounded border border-red/20">Detached HEAD</span>
            </div>
         </div>
      </div>

    </div>
  );
};

// --- Step 3 Visualization: Native Execution ---
const NativeVisual = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]">
      
      <div className="w-full max-w-[400px] flex flex-col gap-10 bg-white/[0.02] border border-white/5 p-8 rounded-2xl backdrop-blur-xl animate-[fade-in_1s_ease-out_forwards]">
        
        <div>
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-medium text-paper flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red"></span> Duck CLI
            </span>
            <span className="text-xs font-mono text-paper-dim/60 uppercase tracking-widest">Execution Time</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full bg-red w-[5%] shadow-[0_0_10px_rgba(255,51,51,0.5)]"></div>
          </div>
          <div className="mt-2 text-[0.65rem] font-mono text-paper-dim text-right">&lt; 5ms overhead</div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-medium text-paper flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-paper/40"></span> Raw Git
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
             <div className="absolute top-0 left-0 h-full bg-paper/40 w-full"></div>
          </div>
          <div className="mt-2 text-[0.65rem] font-mono text-paper-dim text-right">Native Speed</div>
        </div>

      </div>

    </div>
  );
};


const PixelTransition = ({ activeStep, children }) => {
  const [displayStep, setDisplayStep] = useState(activeStep);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (activeStep !== displayStep) {
      setIsAnimating(true);
      setTimeout(() => setDisplayStep(activeStep), 350);
      setTimeout(() => setIsAnimating(false), 700);
    }
  }, [activeStep, displayStep]);

  const blocks = useMemo(() => {
    return Array.from({ length: 400 }).map((_, i) => ({
      id: i,
      enterDelay: Math.random() * 0.3,
      exitDelay: Math.random() * 0.3
    }));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {children(displayStep)}
      </div>
      <div className="absolute inset-0 z-50 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] pointer-events-none">
        {blocks.map((block) => (
          <div 
            key={block.id} 
            className="w-full h-full bg-red"
            style={{
              opacity: isAnimating ? 1 : 0,
              transition: `opacity 0s ${isAnimating ? block.enterDelay : block.exitDelay}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef(null);

  // Auto-advance tabs
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 3) + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeStep]);
  
  const stepContent = [
    {
      id: 1,
      title: "Interceptor Layer",
      visual: <InterceptorVisual />
    },
    {
      id: 2,
      title: "Contextual Engine",
      visual: <ContextVisual />
    },
    {
      id: 3,
      title: "Native Execution",
      visual: <NativeVisual />
    }
  ];

  return (
    <section className="p-0 bg-transparent relative overflow-hidden" id="our-approach" ref={sectionRef}>

      {/* Viewport Centered Badge */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full text-center">
        <div className="badge mx-auto justify-center">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
          How It Works
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto pt-16 pb-0 relative z-10 border-l border-r border-border">
        
        {/* Header Block sitting above the tabs */}
        <div className="px-5 md:px-12 pt-8 pb-12 w-full flex flex-col items-center text-center">
          <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] max-w-4xl mb-6">
            How Duck Works.
          </h2>
          <p className="text-[1.1rem] md:text-[1.25rem] text-[#a1a1aa] leading-[1.6] font-normal max-w-2xl">
            Duck CLI wraps your standard Git commands, adding a thin layer of context, safety, and explanation without getting in your way.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row border-t border-border">
          
          <div className="flex-[1] flex flex-col relative border-r border-border bg-black">
            
            <div className="flex flex-col flex-1 justify-end">
              <button 
              className={`text-left bg-transparent border-t border-b-0 border-x-0 border-border py-5 px-6 lg:px-10 w-full cursor-pointer group relative ${activeStep === 1 ? 'opacity-100 bg-white/[0.01]' : 'opacity-40 hover:opacity-70'}`}
              onClick={() => setActiveStep(1)}
              aria-label="Step 1: The Interceptor"
            >
              {/* Vertical Progress Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-border overflow-hidden">
                <div 
                  className="absolute left-0 top-0 w-full bg-red origin-top"
                  style={{ 
                    height: '100%',
                    transform: activeStep === 1 ? 'scaleY(1)' : 'scaleY(0)',
                    transition: activeStep === 1 ? 'transform 6000ms linear' : 'transform 0s' 
                  }}
                ></div>
              </div>

              <div className="mb-4">
                <div className="font-mono text-[0.65rem] tracking-[0.15em] text-red uppercase mb-2">Step 01</div>
                <h3 className="font-sans text-xl md:text-2xl font-bold leading-[1.1] text-paper m-0 transition-colors duration-300">The Interceptor</h3>
              </div>
              <div className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] ${activeStep === 1 ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                  <div className="text-paper-dim text-[0.85rem] leading-[1.6]">
                    <p className="mb-4 m-0">Duck catches dangerous commands like `reset --hard` or checking out a detached HEAD before they execute.</p>
                    <p className="m-0">It intercepts the action, creates a backup tag so you can always undo, and gives you a clear warning before proceeding.</p>
                  </div>
                </div>
              </div>
            </button>

            <button 
              className={`text-left bg-transparent border-t border-b-0 border-x-0 border-border py-5 px-6 lg:px-10 w-full cursor-pointer group relative ${activeStep === 2 ? 'opacity-100 bg-white/[0.01]' : 'opacity-40 hover:opacity-70'}`}
              onClick={() => setActiveStep(2)}
              aria-label="Step 2: Context Engine"
            >
              {/* Vertical Progress Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-border overflow-hidden">
                <div 
                  className="absolute left-0 top-0 w-full bg-red origin-top"
                  style={{ 
                    height: '100%',
                    transform: activeStep === 2 ? 'scaleY(1)' : 'scaleY(0)',
                    transition: activeStep === 2 ? 'transform 6000ms linear' : 'transform 0s' 
                  }}
                ></div>
              </div>

              <div className="mb-4">
                <div className="font-mono text-[0.65rem] tracking-[0.15em] text-red uppercase mb-2">Step 02</div>
                <h3 className="font-sans text-xl md:text-2xl font-bold leading-[1.1] text-paper m-0 transition-colors duration-300">Context Engine</h3>
              </div>
              <div className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] ${activeStep === 2 ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                  <div className="text-paper-dim text-[0.85rem] leading-[1.6]">
                    <p className="mb-4 m-0">Duck instantly analyzes your repo state (stashes, detached heads, ahead/behind counts) to provide a clear dashboard via `duck radar`.</p>
                    <p className="m-0">This state awareness is also used to explain multi-file merge conflicts in plain English before you start resolving them.</p>
                  </div>
                </div>
              </div>
            </button>

            <button 
              className={`text-left bg-transparent border-t border-b-0 border-x-0 border-border py-5 px-6 lg:px-10 w-full cursor-pointer group relative ${activeStep === 3 ? 'opacity-100 bg-white/[0.01]' : 'opacity-40 hover:opacity-70'}`}
              onClick={() => setActiveStep(3)}
              aria-label="Step 3: Native Execution"
            >
              {/* Vertical Progress Indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-border overflow-hidden">
                <div 
                  className="absolute left-0 top-0 w-full bg-red origin-top"
                  style={{ 
                    height: '100%',
                    transform: activeStep === 3 ? 'scaleY(1)' : 'scaleY(0)',
                    transition: activeStep === 3 ? 'transform 6000ms linear' : 'transform 0s' 
                  }}
                ></div>
              </div>

              <div className="mb-4">
                <div className="font-mono text-[0.65rem] tracking-[0.15em] text-red uppercase mb-2">Step 03</div>
                <h3 className="font-sans text-xl md:text-2xl font-bold leading-[1.1] text-paper m-0 transition-colors duration-300">Native Execution</h3>
              </div>
              <div className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] ${activeStep === 3 ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                  <div className="text-paper-dim text-[0.85rem] leading-[1.6]">
                    <p className="mb-4 m-0">Once a command is deemed safe or manually approved by you, Duck passes it directly to native Git on your system.</p>
                    <p className="m-0">Duck stays out of your way. Fast execution. Zero overhead. You get the safety of a wrapper with the speed of pure Git.</p>
                  </div>
                </div>
              </div>
            </button>
            </div>
          </div>

          <div className="flex-[1.2] relative bg-[#050505] overflow-hidden flex items-center justify-center">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{backgroundImage: 'linear-gradient(var(--paper) 1px, transparent 1px), linear-gradient(90deg, var(--paper) 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
            
            <PixelTransition activeStep={activeStep}>
              {(currentStep) => {
                const step = stepContent.find(s => s.id === currentStep);
                return step ? step.visual : null;
              }}
            </PixelTransition>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
