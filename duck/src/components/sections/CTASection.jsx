import React from 'react';

const CTASection = () => {
  return (
    <section className="relative min-h-[750px] md:min-h-[900px] flex items-center justify-center overflow-hidden border-t border-border z-[10] p-0 bg-transparent">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] md:w-[120vw] max-w-[1400px] aspect-square z-[1] mix-blend-screen opacity-60">
        <picture>
          <source srcSet="/assets/cta-vortex.webp" type="image/webp" />
          <img className="w-full h-full object-cover animate-[spin_120s_linear_infinite]" src="assets/cta-vortex.png" alt="" loading="lazy" />
        </picture>
      </div>

      <img src="/assets/logo1.png" className="absolute w-[150vw] md:w-[100vw] max-w-[1200px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-[2] object-contain" aria-hidden="true" alt="" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-12 flex flex-col items-center justify-center text-center">
        
        <svg className="hidden" aria-hidden="true">
          <defs>
            <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="glow-wide"></feGaussianBlur>
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="glow-tight"></feGaussianBlur>
              <feComposite in="SourceGraphic" in2="glow-wide" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" result="with-wide"></feComposite>
              <feComposite in="with-wide" in2="glow-tight" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0"></feComposite>
            </filter>
          </defs>
        </svg>

        <div className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] mb-12 md:mb-16">
          <img src="/assets/logo1.png" className="absolute top-0 left-0 w-full h-full opacity-50 filter drop-shadow-[0_0_20px_var(--red)] mix-blend-screen" alt="" />
          <img src="/assets/logo1.png" className="absolute top-0 left-0 w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" alt="Duck Logo" />
        </div>
        
        <div className="relative mb-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red/40 filter blur-[80px] rounded-full pointer-events-none z-[-1]"></div>
          <h2 className="font-sans text-[clamp(3.5rem,6vw,6rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] relative z-10 m-0 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
            Stop flying blind in Git.
          </h2>
        </div>
        
        <div className="relative z-20 flex justify-center w-full max-w-[400px] mb-8">
          <button 
            className="btn-primary w-full bg-paper text-ink hover:bg-red hover:text-ink font-bold font-sans tracking-wide uppercase transition-all duration-300 inline-flex items-center justify-center gap-4 text-sm md:text-base p-6 shadow-[0_0_30px_rgba(255,51,51,0.2)] hover:shadow-[0_0_40px_rgba(255,51,51,0.5)]"
            onClick={() => document.getElementById('early-access')?.scrollIntoView({behavior:'smooth'})}
          >
            Install Duck CLI
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 4v8a4 4 0 0 1-4 4H5" />
              <polyline points="9 12 5 16 9 20" />
            </svg>
          </button>
        </div>
        
        <p className="font-mono text-xs md:text-sm tracking-[0.05em] text-paper-45 m-0 relative z-20 uppercase">
          Open source. Easy to install.
        </p>
      </div>
    </section>
  );
};

export default CTASection;
