import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-ink/10">
      <button 
        className="w-full text-left py-6 flex items-start justify-between gap-4 md:gap-8 bg-transparent border-none cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex-1 font-sans font-medium text-lg md:text-xl text-ink transition-colors duration-300 group-hover:text-red">
          {question}
        </span>
        <div className="shrink-0 relative w-6 h-6 mt-1">
          {/* Logo (visible when closed) */}
          <img 
            src="/assets/logo1.png" 
            alt="Toggle FAQ"
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] ${isOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-70 group-hover:opacity-100 scale-[2.2]'}`}
          />
          {/* Cross (visible when opened) */}
          <div className={`absolute inset-0 transition-all duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] ${isOpen ? 'rotate-180 opacity-100 scale-100' : 'rotate-0 opacity-0 scale-50'}`}>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red -translate-y-1/2 rotate-45"></div>
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-red -translate-y-1/2 -rotate-45"></div>
          </div>
        </div>
      </button>
      <div 
        className="grid transition-all duration-500 ease-[cubic-bezier(0.2,1,0.3,1)]"
        style={{ 
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? '0.5rem' : '0'
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-8 pr-12 text-ink/70 text-[0.95rem] leading-[1.6]">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const PixelBorderTop = () => (
  <div className="w-full bg-ink flex justify-center overflow-hidden">
    <div className="w-full max-w-[1000px]">
      <svg viewBox="0 0 120 20" className="w-full h-auto block" preserveAspectRatio="xMidYMax meet">
        <path d="
          M 0 20 
          L 0 14 L 10 14 
          L 10 9 L 18 9 
          L 18 5 L 24 5 
          L 24 0 
          L 96 0 
          L 96 5 L 102 5 
          L 102 9 L 110 9 
          L 110 14 L 120 14 
          L 120 20 Z" 
          fill="var(--paper)" 
        />
        {/* Left Side decorative pixels */}
        <rect x="5" y="4" width="4" height="4" fill="var(--red)" />
        <rect x="6" y="10" width="3" height="3" fill="var(--paper)" />
        <rect x="14" y="14" width="4" height="4" fill="var(--ink)" />
        
        {/* Right Side decorative pixels */}
        <rect x="110" y="4" width="4" height="4" fill="var(--paper)" />
        <rect x="105" y="11" width="3" height="3" fill="var(--red)" />
      </svg>
    </div>
  </div>
);

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Duck CLI? How is it different from other Git wrappers?",
      answer: <p className="m-0">Duck CLI is a lightweight wrapper for Git that prevents common mistakes and provides visual state awareness. It intercepts dangerous commands like `reset --hard` and `force-push`, asks for confirmation, and automatically creates backup tags so you never lose work.</p>
    },
    {
      question: "Does Duck CLI replace Git entirely?",
      answer: <p className="m-0">No, Duck CLI runs native Git under the hood. It acts as an interceptor layer. When a command is safe (or once you approve a dangerous one), Duck passes it directly to your machine's Git executable with zero overhead.</p>
    },
    {
      question: "How does it prevent data loss during resets?",
      answer: <p className="m-0">Before executing destructive history rewrites (like a force-push or hard reset), Duck CLI automatically creates a lightweight recovery tag. If you ever need to undo your action, the "lost" commits are still safely referenced by that tag.</p>
    },
    {
      question: "Does Duck CLI use AI features?",
      answer: <p className="m-0">Only for specific, opt-in features. For example, `duck resolve` uses a local or cloud LLM to explain the context behind multi-file merge conflicts. However, all core safety features, state awareness, and interception logic run entirely locally without AI.</p>
    },
    {
      question: "Will it mess up my existing aliases?",
      answer: <p className="m-0">Duck is designed to be aliased to `git` (so typing `git push` runs Duck), but it respects your existing `.gitconfig` aliases and passes unknown commands directly through to Git.</p>
    },
    {
      question: "What operating systems are supported?",
      answer: <p className="m-0">Duck CLI is supported on macOS, Linux, and Windows (via WSL2 or PowerShell). It requires Node.js and a standard Git installation.</p>
    }
  ];

  return (
    <section className="bg-ink relative">
      <PixelBorderTop />
      
      <div className="w-full bg-paper pb-24 text-ink">
        <div className="w-full max-w-[800px] mx-auto px-5 md:px-12 pt-8">
          <div className="flex flex-col items-center mb-16">
            <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-ink leading-[1.05] tracking-[-0.03em] text-center mb-16">
              Frequently Asked<br />Questions
            </h2>
          </div>
          
          <div className="border-t border-ink/10">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
