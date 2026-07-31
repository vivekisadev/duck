import React from 'react';

const LocalFirstSection = () => {
  return (
    <section className="p-0 relative bg-transparent" id="intro-rig">
      <div className="absolute top-0 h-0 left-0 right-0 md:left-[5%] md:right-[5%] xl:left-[calc(50%-600px)] xl:right-[calc(50%-600px)] overflow-hidden z-0 mix-blend-lighten -translate-y-[140px] pointer-events-none">
        <canvas className="absolute inset-0 w-full h-full" id="shader3"></canvas>
      </div>
      {/* Viewport Centered Badge */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full text-center">
        <div className="badge mx-auto justify-center">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
          The Interceptor
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-28 pb-16 bg-transparent">
        <div className="flex flex-col items-center">
          <div className="text-center max-w-[650px] mb-12">
            <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] mb-6 text-center md:text-left" style={{textShadow: '0 0 8px var(--ink), 0 0 16px var(--ink), 0 0 32px var(--ink), 0 0 60px var(--ink), 0 0 100px var(--ink)'}}>
              Intercepts commands.<br />Prevents disasters.
            </h2>
            <p className="text-paper-dim text-base leading-[1.6]" style={{textWrap: 'balance', textShadow: '0 0 8px var(--ink), 0 0 16px var(--ink), 0 0 32px var(--ink), 0 0 60px var(--ink), 0 0 100px var(--ink)'}}>
              A lightweight wrapper that acts as a checkpoint between you and Git, running completely locally to keep your repo safe.
            </p>
          </div>

          <div className="h-8"></div>

          <div className="w-full max-w-[1000px] relative">
            <svg className="w-full block" viewBox="0 0 560 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{willChange: 'transform', contain: 'layout style paint', transform: 'translateZ(0)'}}>
              <defs>
                <linearGradient id="trail-h1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                  <stop offset="70%" stopColor="#22c55e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="trail-h2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                  <stop offset="70%" stopColor="#22c55e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="trail-block-down" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--red)" stopOpacity="0" />
                  <stop offset="60%" stopColor="var(--red)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--red)" stopOpacity="0" />
                </linearGradient>
                <path id="path-code-rig" d="M130,125 L193,125" />
                <path id="path-rig-resp" d="M353,125 L423,125" />
                <path id="path-cloud-down" d="M273,37 L273,57" />
                <path id="path-rig-telem" d="M273,172 L273,192" />
              </defs>

              <rect x="5" y="68" width="550" height="112" fill="none" stroke="rgba(240,237,230,0.08)" strokeWidth="1" strokeDasharray="4 4" />
              <rect x="15" y="61" width="96" height="14" fill="var(--ink)" />
              <text x="20" y="71" fontFamily="'JetBrains Mono', monospace" fontSize="6" letterSpacing="2" fill="rgba(240,237,230,0.3)">YOUR MACHINE</text>

              <g className="group cursor-default">
                <rect x="20" y="100" width="110" height="50" fill="rgba(10,10,10,0.95)" stroke="rgba(240,237,230,0.15)" strokeWidth="1" className="group-hover:fill-paper-faint group-hover:stroke-border transition-colors duration-150" />
                <text x="75" y="121" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="7" letterSpacing="1.5" fill="rgba(240,237,230,0.4)" className="group-hover:fill-paper transition-colors duration-150">YOUR COMMAND</text>
                <text x="75" y="133" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="5.5" letterSpacing="1" fill="rgba(240,237,230,0.25)" className="group-hover:fill-[#f0ede680] transition-colors duration-150">git reset --hard</text>
              </g>

              <line x1="130" y1="125" x2="193" y2="125" stroke="rgba(34,197,94,0.15)" strokeWidth="1" pointerEvents="none" />

              <rect x="-1.5" y="-1.5" width="3" height="3" fill="#22c55e" pointerEvents="none">
                <animateMotion dur="2s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href="#path-code-rig" />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="2s" repeatCount="indefinite" />
              </rect>

              <line x1="130" y1="125" x2="193" y2="125" stroke="url(#trail-h1)" strokeWidth="2" pointerEvents="none">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
              </line>

              <g className="group cursor-default">
                <rect x="193" y="78" width="160" height="94" fill="rgba(10,10,10,0.95)" stroke="rgba(240,237,230,0.2)" strokeWidth="1.5" className="group-hover:fill-paper-faint group-hover:stroke-border transition-colors duration-150" />
                <text x="274.5" y="108" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="12" letterSpacing="3" fill="var(--paper)" className="group-hover:fill-paper transition-colors duration-150">DUCK CLI</text>
                <text x="273" y="124" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="5.5" letterSpacing="1.5" fill="#22c55e" className="group-hover:fill-green transition-colors duration-150">&#x2713; SAFE WRAPPER</text>
                <line x1="210" y1="145" x2="336" y2="145" stroke="rgba(240,237,230,0.08)" strokeWidth="0.5" className="group-hover:stroke-[#f0ede62e] transition-colors duration-150" />
                <text x="238" y="160" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="5" letterSpacing="1" fill="rgba(240,237,230,0.25)" className="group-hover:fill-[#f0ede680] transition-colors duration-150">STATE</text>
                <text x="273" y="160" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="5" letterSpacing="1" fill="rgba(240,237,230,0.25)" className="group-hover:fill-[#f0ede680] transition-colors duration-150">SAFETY</text>
                <text x="308" y="160" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="5" letterSpacing="1" fill="rgba(240,237,230,0.25)" className="group-hover:fill-[#f0ede680] transition-colors duration-150">BACKUP</text>
              </g>

              <line x1="353" y1="125" x2="423" y2="125" stroke="rgba(34,197,94,0.15)" strokeWidth="1" pointerEvents="none" />

              <rect x="-1.5" y="-1.5" width="3" height="3" fill="#22c55e" pointerEvents="none">
                <animateMotion dur="2s" begin="1s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href="#path-rig-resp" />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="2s" begin="1s" repeatCount="indefinite" />
              </rect>

              <line x1="353" y1="125" x2="423" y2="125" stroke="url(#trail-h2)" strokeWidth="2" pointerEvents="none">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" begin="1s" repeatCount="indefinite" />
              </line>

              <g className="group cursor-default">
                <rect x="423" y="100" width="120" height="50" fill="rgba(10,10,10,0.95)" stroke="rgba(240,237,230,0.15)" strokeWidth="1" className="group-hover:fill-paper-faint group-hover:stroke-border transition-colors duration-150" />
                <text x="483" y="121" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="7" letterSpacing="1.5" fill="rgba(240,237,230,0.4)" className="group-hover:fill-paper transition-colors duration-150">GIT ENGINE</text>
                <text x="483" y="133" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="5.5" letterSpacing="1" fill="#22c55e" className="group-hover:fill-green transition-colors duration-150">NATIVE EXECUTION</text>
              </g>

              <g className="group cursor-default">
                <rect x="213" y="5" width="120" height="32" fill="rgba(10,10,10,0.95)" stroke="rgba(240,237,230,0.1)" strokeWidth="1" className="group-hover:fill-paper-faint group-hover:stroke-border transition-colors duration-150" />
                <text x="273" y="21" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="7" letterSpacing="1.5" fill="rgba(240,237,230,0.4)" className="group-hover:fill-paper transition-colors duration-150">DANGEROUS CMD</text>
              </g>

              <line x1="273" y1="37" x2="273" y2="78" stroke="var(--red)" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.4" pointerEvents="none" />

              <rect x="-1.5" y="-1.5" width="3" height="3" fill="var(--red)" pointerEvents="none">
                <animateMotion dur="1.5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href="#path-cloud-down" />
                </animateMotion>
                <animate attributeName="opacity" values="0.8;0.8;0" keyTimes="0;0.6;1" dur="1.5s" repeatCount="indefinite" />
              </rect>

              <g>
                <line x1="267" y1="51" x2="279" y2="63" stroke="var(--red)" strokeWidth="1.5" />
                <line x1="279" y1="51" x2="267" y2="63" stroke="var(--red)" strokeWidth="1.5" />
              </g>

              <g className="group cursor-default">
                <rect x="213" y="215" width="120" height="32" fill="rgba(10,10,10,0.95)" stroke="rgba(240,237,230,0.1)" strokeWidth="1" className="group-hover:fill-paper-faint group-hover:stroke-border transition-colors duration-150" />
                <text x="273" y="231" textAnchor="middle" dominantBaseline="central" fontFamily="'JetBrains Mono', monospace" fontSize="7" letterSpacing="1.5" fill="rgba(240,237,230,0.4)" className="group-hover:fill-paper transition-colors duration-150">SECRET LEAK</text>
              </g>

              <line x1="273" y1="172" x2="273" y2="215" stroke="var(--red)" strokeWidth="0.5" strokeDasharray="3 5" opacity="0.4" pointerEvents="none" />

              <rect x="-1.5" y="-1.5" width="3" height="3" fill="var(--red)" pointerEvents="none">
                <animateMotion dur="1.5s" begin="0.75s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                  <mpath href="#path-rig-telem" />
                </animateMotion>
                <animate attributeName="opacity" values="0.8;0.8;0" keyTimes="0;0.6;1" dur="1.5s" begin="0.75s" repeatCount="indefinite" />
              </rect>

              <g>
                <line x1="267" y1="187" x2="279" y2="199" stroke="var(--red)" strokeWidth="1.5" />
                <line x1="279" y1="187" x2="267" y2="199" stroke="var(--red)" strokeWidth="1.5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalFirstSection;
