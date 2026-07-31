import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [phase, setPhase] = useState('filling'); // filling -> reveal -> done

  useEffect(() => {
    // Phase 1: Filling (takes 1.5s)
    const fillTimer = setTimeout(() => {
      setPhase('reveal');
    }, 1500);

    // Phase 2: Reveal "DUCK" text and hold (takes 1.2s)
    const doneTimer = setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 600); // fade out duration
    }, 3200);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div 
          className="fixed inset-0 z-[100000] bg-ink flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)' }}
          transition={{ duration: 0.6, ease: [0.2, 1, 0.3, 1] }}
        >
          {/* 
            This flex container guarantees perfect dead-center alignment.
            As the text container's width expands, flexbox naturally pushes the logo left to keep the whole group centered. 
          */}
          <motion.div layout className="flex items-center justify-center" transition={{ duration: 1.2, ease: "easeInOut" }}>
            
            {/* The Logo Container (z-10 to stay on top of text) */}
            <motion.div 
              className="relative w-40 h-52 md:w-48 md:h-64 z-10 shrink-0"
              layout
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* Dimmed Background Logo */}
              <img 
                src="/assets/logo1.png" 
                alt="Loading"
                className="absolute inset-0 w-full h-full object-contain opacity-20 filter grayscale"
              />
              
              {/* Bright Filled Logo */}
              <motion.div 
                className="absolute inset-0"
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <img 
                  src="/assets/logo1.png" 
                  alt="Loading Fill"
                  className="absolute inset-0 w-full h-full object-contain origin-bottom"
                />
              </motion.div>
            </motion.div>

            {/* 
              Expanding Text Container 
              - Negative left margin (-ml-12/-ml-16) pulls this container UNDER the logo's transparent padding,
                so the text appears to emerge directly from the solid duck figure.
              - Animating width from 0 to auto naturally expands the flex container.
            */}
            <motion.div 
              className="relative overflow-hidden flex items-center z-0 -ml-12 md:-ml-16"
              initial={{ width: 0 }}
              animate={{ width: phase === 'reveal' ? 'auto' : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* 
                Text Translation
                - Starts completely shifted to the left (-100%) so it is hidden.
                - As it translates right (to 0%), the "K" crosses the right boundary first, 
                  creating the exact "K, CK, UCK, DUCK" letter-by-letter reveal!
              */}
              <motion.div 
                className="font-sans font-bold text-5xl md:text-7xl text-paper tracking-[-0.04em] whitespace-nowrap pl-2 pr-4 mb-1.5 md:mb-2.25"
                initial={{ x: '-100%' }}
                animate={{ x: phase === 'reveal' ? '0%' : '-100%' }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                DUCK
              </motion.div>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
