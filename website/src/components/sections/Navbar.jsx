import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path.includes('#')) {
      const [pathname, hash] = path.split('#');
      return location.pathname === pathname && location.hash === '#' + hash;
    }
    if (path === '/' && location.pathname === '/') {
      return location.hash === '';
    }
    return location.pathname === path;
  };

  const getLinkClass = (path) => {
    const baseClass = "font-mono text-xs md:text-sm font-bold max-md:text-xl no-underline tracking-wide transition-all duration-300";
    const activeClass = "text-red drop-shadow-[0_0_8px_rgba(255,87,26,0.8)]";
    const inactiveClass = "text-paper/80 max-md:text-paper hover:text-paper";
    
    return `${baseClass} ${isActive(path) ? activeClass : inactiveClass}`;
  };

  return (
    <header className="flex w-full absolute top-0 left-0 z-[10002] bg-ink grid-border-b">
      <nav className="w-full max-w-7xl mx-auto px-5 md:px-12 py-3 md:py-4 flex justify-between items-center relative" aria-label="Main navigation">
        <Link to="/" className="flex items-center text-paper" aria-label="Duck CLI — Home">
          <img src="/assets/logo1.png" alt="Duck Logo" className="w-10 h-13 md:w-12 md:h-13 object-contain -mr-1 md:-mr-2" />
          <span className="font-sans text-xl md:text-2xl font-bold tracking-tight">DUCK CLI</span>
        </Link>
        
        <button 
          className="md:hidden flex flex-col gap-[5px] p-2 z-[10002] bg-transparent border-none cursor-pointer group"
          aria-expanded={isOpen} 
          aria-controls="nav-menu" 
          aria-label="Toggle navigation" 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-6 h-[2px] transition-all duration-300 origin-center ${isOpen ? 'bg-paper translate-y-[7px] rotate-45' : 'bg-paper'}`}></span>
          <span className={`w-6 h-[2px] transition-all duration-300 ${isOpen ? 'bg-paper opacity-0' : 'bg-paper'}`}></span>
          <span className={`w-6 h-[2px] transition-all duration-300 origin-center ${isOpen ? 'bg-paper -translate-y-[7px] -rotate-45' : 'bg-paper'}`}></span>
        </button>
        
        <ul className={`
          flex items-center gap-8 m-0 p-0 list-none
          max-md:fixed max-md:inset-0 max-md:flex-col max-md:justify-center max-md:gap-10 max-md:bg-ink max-md:p-8 max-md:z-[10001]
          transition-all duration-300
          ${isOpen ? 'max-md:opacity-100 max-md:visible' : 'max-md:opacity-0 max-md:invisible'}
        `} id="nav-menu" role="list">
          <li>
            <Link to="/#problem" className={getLinkClass('/#problem')} onClick={() => setIsOpen(false)}>
              The Problem
            </Link>
          </li>
          <li>
            <Link to="/#how-it-works" className={getLinkClass('/#how-it-works')} onClick={() => setIsOpen(false)}>
              How it Works
            </Link>
          </li>
          <li>
            <Link to="/problems" className={getLinkClass('/problems')} onClick={() => setIsOpen(false)}>
              Pain Points
            </Link>
          </li>
          <li>
            <Link to="/docs" className={getLinkClass('/docs')} onClick={() => setIsOpen(false)}>
              Docs
            </Link>
          </li>
          <li>
            <Link id="nav-join-btn" to="/#install" className="btn-primary max-md:bg-red max-md:text-ink max-md:hover:bg-paper font-bold font-sans tracking-wide uppercase transition-all duration-200 inline-flex items-center justify-center text-xs md:text-sm h-[22px] py-6 px-6" onClick={() => setIsOpen(false)}>
              Install Now
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
