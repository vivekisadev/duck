import React from 'react';

const FooterSection = () => {
  return (
    <footer className="relative bg-transparent overflow-hidden pt-16 md:pt-24 pb-12 border-t border-border">
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-24">
          <div className="md:col-span-6 lg:col-span-5 flex flex-col items-start gap-6">
            <a href="/" className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80">
              <img src="/assets/logo1.png" alt="Duck Logo" className="w-10 h-10 object-contain" />
              <span className="font-sans text-3xl font-bold tracking-tight text-paper">DUCK CLI</span>
            </a>
            <p className="text-paper-dim text-sm leading-[1.6] max-w-[300px]">
              The safety net for Git that developers actually want.
            </p>
          </div>
          
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-9">
            <h3 className="font-mono text-[0.65rem] tracking-[0.15em] text-red uppercase mb-6">Connect</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              <li>
                <a href="https://x.com/duck_cli" target="_blank" rel="noopener noreferrer" className="text-paper-dim text-sm hover:text-paper transition-colors duration-200 no-underline">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-paper-dim text-sm hover:text-paper transition-colors duration-200 no-underline">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="font-mono text-[0.65rem] tracking-[0.15em] text-red uppercase mb-6">Legal</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-4">
              <li>
                <a href="#" className="text-paper-dim text-sm hover:text-paper transition-colors duration-200 no-underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-mono text-[0.65rem] tracking-[0.1em] text-paper-45 uppercase text-center md:text-left">
            &copy; 2026 Duck CLI. All rights reserved.
          </span>
          
          <div className="flex items-center gap-2 px-3 py-1.5 border border-paper-faint bg-paper-04 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-[signal-flicker_4s_ease-in-out_infinite]" style={{boxShadow: '0 0 8px #22c55e'}}></span>
            <span className="font-mono text-[0.55rem] tracking-[0.15em] text-paper uppercase">All systems local</span>
          </div>
        </div>
        
      </div>
      
      <img src="/assets/logo1.png" className="absolute -bottom-8 md:-bottom-12 -right-8 md:-right-12 w-[180px] md:w-[320px] opacity-[0.04] pointer-events-none z-0" aria-hidden="true" alt="" />
    </footer>
  );
};

export default FooterSection;
