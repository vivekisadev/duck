import React, { useEffect, useState } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure the animation triggers after initial render
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`min-h-[50vh] bg-ink flex flex-col relative overflow-hidden w-screen -ml-[calc(50vw-50%)] z-[10000] ${isVisible ? 'is-visible' : ''}`}>

      
      {/* Hero watermark (faded Duck logo/text) */}
      <img 
        src="/assets/logo1.png" 
        alt="Duck Watermark"
        className={`absolute left-[350px] top-[45vh] -translate-x-1/2 -translate-y-1/2 h-[160%] md:h-[220%] w-auto max-w-none opacity-10 pointer-events-none object-contain mix-blend-screen ${isVisible ? 'animate-[watermark-glitch_4s_linear_infinite]' : ''}`}
        aria-hidden="true"
      />
      
      <div className="flex-1 flex flex-col justify-center items-start px-5 md:px-12 max-w-[1200px] mx-auto w-full relative z-10 pt-24 pb-12">
        <h1 className="font-sans text-[clamp(3.5rem,12vw,7rem)] md:text-[clamp(3.5rem,8vw,7rem)] leading-[0.88] text-paper tracking-[-0.04em] mb-8 relative mt-8">
          Your Git<br />Safety Net.
        </h1>
        <p className="text-base md:text-[1.15rem] font-semibold text-paper/80 max-w-[540px] leading-[1.6] mb-10">
          Duck intercepts your git commands to prevent detached HEADs, explain merge conflicts, and stop destructive force-pushes before they happen.
        </p>
        <div className="flex flex-wrap md:flex-nowrap gap-4 mb-12 w-full md:w-auto">
          <a href="#install" className="btn-primary px-8 py-4 w-full md:w-auto flex-1 md:flex-none">
            Install Duck CLI
          </a>
          <a href="#how-it-works" className="btn-dark px-8 py-4 border border-border w-full md:w-auto flex-1 md:flex-none">
            How It Works
          </a>
        </div>
      </div>
      
      {/* Ticker */}
      <div className="border-t border-border py-3 overflow-hidden relative z-10">
        <div className={`flex gap-8 md:gap-16 whitespace-nowrap font-pixel text-xs text-red tracking-widest uppercase ${isVisible ? 'animate-ticker' : ''}`}>
          {/* Double the content for smooth infinite marquee */}
          {Array(2).fill(0).map((_, i) => (
            <React.Fragment key={i}>
              <span>No Detached HEADs</span>
              <span>&bull;</span>
              <span>Safe Force-Push</span>
              <span>&bull;</span>
              <span>Always-On Radar</span>
              <span>&bull;</span>
              <span>Contextual Pull</span>
              <span>&bull;</span>
              <span>Interactive Conflicts</span>
              <span>&bull;</span>
              <span>Secret Scanning</span>
              <span>&bull;</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
