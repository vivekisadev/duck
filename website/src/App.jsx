import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import FooterSection from './components/sections/FooterSection';
import Home from './pages/Home';
import Documentation from './Documentation';
import ProblemsPage from './pages/ProblemsPage';
import Navbar from './components/sections/Navbar';
import InteractiveTerminal from './components/InteractiveTerminal';
import './index.css';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          lenis.scrollTo(element, { offset: -80 });
        }, 100);
      }
    } else {
      lenis.scrollTo(0);
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, [location]);

  const GlobalDashedGrid = () => (
    <div className="fixed inset-0 z-[10001] pointer-events-none flex justify-center overflow-hidden">
      <div className="flex-1 w-full h-full"></div>
      <div className="w-full max-w-[1200px] h-full border-l border-r border-border relative"></div>
      <div className="flex-1 w-full h-full"></div>
    </div>
  );

  const SectionSeparator = () => (
    <div className="w-full flex justify-center my-0 relative z-20">
      <div className="w-full max-w-[1200px] h-12 sm:h-16 border-y border-border" style={{
        backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,87,26,0.15), rgba(255,87,26,0.15) 1px, transparent 1px, transparent 4px)'
      }}></div>
    </div>
  );

  return (
    <div className="bg-ink min-h-screen text-paper overflow-x-clip selection:bg-red selection:text-ink relative">
      <Navbar />
      <GlobalDashedGrid />
      <Routes>
        <Route path="/" element={<Home SectionSeparator={SectionSeparator} />} />
        <Route path="/docs" element={<Documentation SectionSeparator={SectionSeparator} />} />
        <Route path="/problems" element={<ProblemsPage />} />
      </Routes>
      <FooterSection />

      {/* Floating Terminal Trigger */}
      <button
        onClick={() => setIsTerminalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[10004] bg-[#0a0a0a] border border-border text-paper px-4 py-3 font-mono text-sm shadow-[0_0_20px_rgba(255,87,26,0.2)] hover:shadow-[0_0_30px_rgba(255,87,26,0.4)] hover:border-red transition-all duration-300 flex items-center gap-3 group"
      >
        <span className="text-red font-bold group-hover:animate-pulse">❯_</span>
        <span className="hidden sm:inline">Try Duck CLI</span>
      </button>

      {/* Interactive Terminal Modal */}
      {isTerminalOpen && (
        <InteractiveTerminal onClose={() => setIsTerminalOpen(false)} />
      )}
    </div>
  );
}

export default App;
