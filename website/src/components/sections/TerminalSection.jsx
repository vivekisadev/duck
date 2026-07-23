import React, { useState, useEffect, useRef } from 'react';

const TerminalSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const containerRef = useRef(null);

  const features = [
    {
      num: "01",
      title: "Always-on state dashboard.",
      desc: "duck radar instantly shows your branch, stash count, uncommitted changes, and ahead/behind counts in one clear view so you never fly blind.",
      lines: [
        { text: "$ duck radar", type: "cmd" },
        { text: "📡 Scanning repository state...", type: "dim" },
        { text: "BRANCH : feature/auth (ahead 1, behind 0)", type: "info" },
        { text: "STASHES: 2 hidden stashes detected", type: "warn" },
        { text: "STATUS : 3 uncommitted files", type: "error" }
      ]
    },
    {
      num: "02",
      title: "The Detached HEAD Guard.",
      desc: "duck goto catches you before you check out a commit directly. It warns you and prompts you to create a branch, preventing lost commits.",
      lines: [
        { text: "$ duck goto HEAD~3", type: "cmd" },
        { text: "[WARN] You are about to enter a detached HEAD state.", type: "warn" },
        { text: "Creating temporary safety branch 'duck-safe-HEAD~3'...", type: "dim" },
        { text: "[OK] Safe to explore. Commits will not be lost.", type: "success" }
      ]
    },
    {
      num: "03",
      title: "Safe Destructive Commands.",
      desc: "Before a force-push or hard reset, duck pauses, explains what will be lost, and automatically creates a backup tag so you always have an undo.",
      lines: [
        { text: "$ duck force-push", type: "cmd" },
        { text: "[BLOCK] This will overwrite remote history.", type: "error" },
        { text: "Creating automatic backup tag: duck-backup-17a9b...", type: "dim" },
        { text: "[OK] Backup created. Proceeding with force-push.", type: "success" }
      ]
    },
    {
      num: "04",
      title: "Fetch vs. Pull Clarity.",
      desc: "duck fetch explicitly tells you what changed without touching your code. duck pull explains exactly what strategy it will use before merging.",
      lines: [
        { text: "$ duck pull", type: "cmd" },
        { text: "Fetching origin/main...", type: "dim" },
        { text: "[INFO] You are 3 commits behind origin/main.", type: "info" },
        { text: "Strategy: Fast-forward merge.", type: "success" }
      ]
    },
    {
      num: "05",
      title: "Interactive Merge Conflicts.",
      desc: "duck resolve breaks down intimidating conflict markers one file at a time, explaining why the two sides diverged in plain English.",
      lines: [
        { text: "$ duck resolve", type: "cmd" },
        { text: "Found conflict in src/auth.js", type: "warn" },
        { text: ">> YOU added a new JWT token check.", type: "info" },
        { text: ">> THEY updated the import statements.", type: "info" },
        { text: "Press [Enter] to open interactive resolver...", type: "dim" }
      ]
    },
    {
      num: "06",
      title: "Pre-commit Secret Scanning.",
      desc: "duck ignore-audit checks your staged files for API keys and massive directories before they ever make it into your permanent history.",
      lines: [
        { text: "$ duck commit -m \"update\"", type: "cmd" },
        { text: "Scanning staged files...", type: "dim" },
        { text: "[BLOCK] Found AWS_ACCESS_KEY_ID in .env", type: "error" },
        { text: "Commit aborted. Add .env to .gitignore first.", type: "error" }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const scrollProgress = -top / (height - viewportHeight);
      
      if (top <= 0 && scrollProgress <= 1) {
        const index = Math.min(
          features.length - 1, 
          Math.max(0, Math.floor(scrollProgress * features.length))
        );
        setActiveFeature(index);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [features.length]);

  return (
    <section className="bg-transparent relative" ref={containerRef} style={{ height: `${features.length * 100}vh` }}>
      <div className="sticky top-0 w-full overflow-hidden p-0 bg-transparent relative">
          {/* Viewport Centered Badge */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 w-full text-center">
            <div className="badge mx-auto justify-center">
          <div className="w-1.5 h-1.5 bg-red shrink-0"></div>
              Core Features
            </div>
          </div>
          
          <div className="w-full max-w-[1200px] mx-auto pt-16 pb-16 relative z-10 border-l border-r border-border">
          
          <div className="flex flex-col md:flex-row h-[500px] md:h-[600px] gap-8 lg:gap-12 px-6 md:px-12 pt-8 md:pt-0">
            <div className="flex-1 flex flex-col justify-center relative">
              <div className="mb-12">
                <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] mb-4">
                  Your workflow, protected.
                </h2>
                <p className="text-[1.1rem] md:text-[1.25rem] text-[#a1a1aa] leading-[1.6] font-normal max-w-xl">
                  Execute complex operations with confidence knowing every destructive command is backed by a lightweight safety net.
                </p>
              </div>
            <div className="relative h-[200px] w-full">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] ${
                    index === activeFeature 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : index < activeFeature
                        ? 'opacity-0 -translate-y-8 pointer-events-none'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                  }`}
                >
                  <div className="font-mono text-[0.65rem] tracking-[0.15em] text-red uppercase mb-4">
                    [ {feature.num} ]
                  </div>
                  <h3 className="font-sans font-bold text-2xl leading-[1.1] text-paper mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-paper-dim text-base leading-[1.6] max-w-[450px]">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side: Visual Cards */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-[500px] bg-ink grid-border rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 p-8 flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] ${
                    index === activeFeature 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : index < activeFeature
                        ? 'opacity-0 scale-95 -rotate-2'
                        : 'opacity-0 scale-105 rotate-2'
                  }`}
                >
                  <div className="w-full h-full border border-dashed border-red/30 rounded-lg flex flex-col bg-red/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Terminal Window Header */}
                    <div className="h-8 border-b border-dashed border-red/30 flex items-center px-3 gap-1.5 relative z-10 bg-ink/50 backdrop-blur-sm w-full">
                      <div className="w-2.5 h-2.5 rounded-full border border-red/40 bg-red/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full border border-red/40 bg-red/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full border border-red/40 bg-red/20"></div>
                      <div className="ml-auto font-mono text-[0.6rem] text-red/40 tracking-widest uppercase">duck-cli</div>
                    </div>
                    
                    {/* Terminal Content */}
                    <div className="flex-1 p-5 font-mono text-[0.7rem] md:text-xs leading-relaxed flex flex-col gap-2 relative z-10 text-left w-full overflow-hidden">
                      {feature.lines.map((line, i) => (
                        <div 
                          key={i}
                          className={`
                            transform transition-all duration-500
                            ${index === activeFeature ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}
                            ${line.type === 'cmd' ? 'text-paper font-bold mb-1' : ''}
                            ${line.type === 'dim' ? 'text-paper-dim' : ''}
                            ${line.type === 'info' ? 'text-blue-400' : ''}
                            ${line.type === 'warn' ? 'text-yellow-500' : ''}
                            ${line.type === 'error' ? 'text-red' : ''}
                            ${line.type === 'success' ? 'text-green-500' : ''}
                          `}
                          style={{ transitionDelay: `${index === activeFeature ? i * 100 + 200 : 0}ms` }}
                        >
                          {line.text}
                        </div>
                      ))}
                      <div 
                        className={`w-2 h-4 bg-red/60 mt-1 animate-pulse transition-opacity duration-500 ${index === activeFeature ? 'opacity-100' : 'opacity-0'}`}
                        style={{ transitionDelay: `${index === activeFeature ? feature.lines.length * 100 + 200 : 0}ms` }}
                      ></div>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      </div>
    </section>
  );
};

export default TerminalSection;
