import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import AnimatedCopyButton from '../AnimatedCopyButton';

// The pixelated overlay effect
const PixelOverlay = ({ isAnimating }) => {
  const blocks = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      enterDelay: Math.random() * 0.2,
      exitDelay: Math.random() * 0.2
    }));
  }, []);

  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    if (isAnimating) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (!shouldRender) return null;

  return (
    <div className="absolute inset-0 z-50 grid grid-cols-[repeat(15,1fr)] grid-rows-[repeat(10,1fr)] pointer-events-none">
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
  );
};

export default function SimulationTerminal({ gitCommand, gitOutput, duckCommand, duckOutput }) {
  const [activeTab, setActiveTab] = useState('git');
  const [displayTab, setDisplayTab] = useState('git');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  
  const [height, setHeight] = useState('auto');
  
  const terminalRef = useRef(null);
  const contentRef = useRef(null);

  // Viewport detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.6 }
    );

    if (terminalRef.current) observer.observe(terminalRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto switch
  useEffect(() => {
    if (isVisible && !userInteracted && activeTab === 'git') {
      const timer = setTimeout(() => {
        handleTabChange('duck');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, userInteracted, activeTab]);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    
    // 1. Lock the current height explicitly before changing content
    if (contentRef.current) {
      setHeight(contentRef.current.getBoundingClientRect().height);
    }

    setIsAnimating(true);
    setActiveTab(tab);
    
    // 2. Mid-way through pixel animation, swap the text
    setTimeout(() => {
      setDisplayTab(tab);
    }, 250);
    
    // 3. Complete pixel animation
    setTimeout(() => {
      setIsAnimating(false);
    }, 450);
  };

  const handleManualTabChange = (tab) => {
    setUserInteracted(true);
    handleTabChange(tab);
  };

  // Smooth height transition logic when content changes
  useLayoutEffect(() => {
    if (height !== 'auto' && contentRef.current) {
      const el = contentRef.current;
      
      // Temporarily remove the explicit height to measure the natural height of the new content
      const currentInlineHeight = el.style.height;
      el.style.height = 'auto';
      const naturalHeight = el.getBoundingClientRect().height;
      
      // Restore the locked height so the CSS transition has a starting point
      el.style.height = currentInlineHeight;
      
      // Force a browser reflow to acknowledge the starting point
      void el.offsetHeight;
      
      // Update state to the new natural height to trigger the CSS transition
      setHeight(naturalHeight);
      
      // Reset to auto after the transition finishes (matches duration-300)
      const timer = setTimeout(() => {
        setHeight('auto');
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [displayTab]);

  const currentCommand = displayTab === 'git' ? gitCommand : duckCommand;
  const currentOutput = displayTab === 'git' ? gitOutput : duckOutput;

  return (
    <div ref={terminalRef} className="border border-border bg-ink rounded-lg overflow-hidden relative shadow-[0_0_15px_rgba(255,87,26,0.05)] mt-6">
      
      {/* Terminal Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-paper/5 relative z-10">
        <div className="flex gap-2 w-[60px]">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-ink border border-border p-1 rounded-md relative overflow-hidden">
          <button 
            onClick={() => handleManualTabChange('git')}
            className={`relative z-10 px-3 py-1 text-xs font-mono font-medium rounded transition-colors ${activeTab === 'git' ? 'bg-paper/10 text-paper' : 'text-paper-dim hover:text-paper'}`}
          >
            Standard Git
          </button>
          <button 
            onClick={() => handleManualTabChange('duck')}
            className={`relative z-10 px-3 py-1 text-xs font-mono font-medium rounded transition-colors overflow-hidden ${activeTab === 'duck' ? 'bg-red/20 text-red' : 'text-paper-dim hover:text-red'}`}
          >
            {isVisible && !userInteracted && activeTab === 'git' && (
              <div 
                className="absolute left-0 bottom-0 h-[2px] bg-red w-full origin-left opacity-60"
                style={{ animation: 'terminal-progress 3s linear forwards' }}
              ></div>
            )}
            Duck CLI
          </button>
        </div>

        <div className="flex justify-end w-[60px]">
          <AnimatedCopyButton textToCopy={currentCommand} size="sm" />
        </div>
      </div>

      {/* Terminal Body with Pixel Transition Overlay */}
      <div className="relative bg-ink">
        <PixelOverlay isAnimating={isAnimating} />
        
        <div 
          ref={contentRef}
          style={{ height: height === 'auto' ? 'auto' : `${height}px` }}
          className="p-5 font-mono text-[0.85rem] text-paper-dim whitespace-pre-wrap overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] min-h-[100px]"
        >
          <div className="flex gap-3 mb-4">
            <span className="text-red select-none">$</span>
            <span className="text-paper">{currentCommand}</span>
          </div>
          {currentOutput && (
            <div className={displayTab === 'git' ? 'text-[#a1a1aa]' : 'text-[#a1a1aa]'}>
              {currentOutput}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes terminal-progress { 
          from { transform: scaleX(0); } 
          to { transform: scaleX(1); } 
        }
      `}} />
    </div>
  );
}
