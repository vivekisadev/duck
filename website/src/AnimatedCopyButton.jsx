import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedCopyButton({
  textToCopy,
  size = "md",
  onCopy,
  style = {}
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      if (onCopy) onCopy();

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const sizes = {
    sm: { width: '32px', height: '32px' },
    md: { width: '40px', height: '40px' },
    lg: { width: '48px', height: '48px' },
  };

  const iconSizes = {
    sm: { width: '16px', height: '16px' },
    md: { width: '20px', height: '20px' },
    lg: { width: '24px', height: '24px' },
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy to clipboard"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ...sizes[size],
        ...style
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}
          >
            {/* Check Icon */}
            <svg xmlns="http://www.w3.org/w3.org/2000/svg" width={iconSizes[size].width} height={iconSizes[size].height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa' }}
          >
            {/* Copy Icon */}
            <svg xmlns="http://www.w3.org/w3.org/2000/svg" width={iconSizes[size].width} height={iconSizes[size].height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Ripple Effect on Copy */}
      {isCopied && (
        <motion.div
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            pointerEvents: 'none'
          }}
        />
      )}
    </button>
  );
}
