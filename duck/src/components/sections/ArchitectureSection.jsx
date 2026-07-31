import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Lock, Brain, GitCommit, CheckCircle, Database } from 'lucide-react';

const NodeCard = ({ icon: Icon, title, desc, delay = 0, isRed = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className={`relative z-10 flex flex-col items-center justify-center p-6 w-full h-full backdrop-blur-md transition-all duration-500
      ${isRed ? 'bg-red text-ink shadow-[0_0_20px_rgba(255,87,26,0.2)] hover:shadow-[0_0_40px_rgba(255,87,26,0.6)]' : 'bg-[#0a0a0a] border border-border/40 hover:border-red/60 text-paper'}
    `}
  >
    {!isRed && <div className="absolute inset-0 bg-gradient-to-br from-red/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />}
    
    {Icon && (
      <div className={`mb-4 ${isRed ? 'text-ink' : 'text-red'} transition-transform duration-300 hover:scale-110`}>
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
    )}
    <h3 className={`font-sans font-bold text-[1.1rem] mb-2 text-center tracking-tight ${isRed ? 'text-ink' : 'text-paper'}`}>
      {title}
    </h3>
    <p className={`text-[0.85rem] text-center leading-relaxed ${isRed ? 'text-ink/80 font-medium' : 'text-paper-dim'}`}>
      {desc}
    </p>
  </motion.div>
);

const VertLine = ({ height = "h-12", delay = 0, className = "" }) => (
  <div className={`relative w-px ${height} flex-shrink-0 mx-auto ${className}`}>
    <motion.div 
      initial={{ height: 0 }}
      whileInView={{ height: "100%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-red to-transparent z-10"
      style={{ filter: 'drop-shadow(0 0 6px rgba(255,87,26,0.6))' }}
    />
    <div className="absolute inset-0 w-full h-full bg-border/30" />
  </div>
);

const SplitLines = ({ delay = 0 }) => (
  <div className="relative w-[500px] h-[64px] mx-auto hidden md:block">
     <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 500 64">
       {/* Background tracks */}
       <path d="M 250 0 L 250 32 L 125 32 L 125 64" fill="none" stroke="rgba(255,87,26,0.15)" strokeWidth="1" />
       <path d="M 250 0 L 250 32 L 375 32 L 375 64" fill="none" stroke="rgba(255,87,26,0.15)" strokeWidth="1" />
       
       {/* Animated glowing paths */}
       <motion.path 
         d="M 250 0 L 250 32 L 125 32 L 125 64" 
         fill="none" 
         stroke="var(--red)" 
         strokeWidth="2"
         initial={{ pathLength: 0, opacity: 0 }}
         whileInView={{ pathLength: 1, opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8, delay }}
         style={{ filter: 'drop-shadow(0 0 6px rgba(255,87,26,0.6))' }}
       />
       <motion.path 
         d="M 250 0 L 250 32 L 375 32 L 375 64" 
         fill="none" 
         stroke="var(--red)" 
         strokeWidth="2"
         initial={{ pathLength: 0, opacity: 0 }}
         whileInView={{ pathLength: 1, opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8, delay }}
         style={{ filter: 'drop-shadow(0 0 6px rgba(255,87,26,0.6))' }}
       />
     </svg>
  </div>
);

const MergeLines = ({ delay = 0 }) => (
  <div className="relative w-[500px] h-[64px] mx-auto hidden md:block">
     <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 500 64">
       {/* Background tracks */}
       <path d="M 125 0 L 125 32 L 250 32 L 250 64" fill="none" stroke="rgba(255,87,26,0.15)" strokeWidth="1" />
       <path d="M 375 0 L 375 32 L 250 32 L 250 64" fill="none" stroke="rgba(255,87,26,0.15)" strokeWidth="1" />
       
       {/* Animated glowing paths */}
       <motion.path 
         d="M 125 0 L 125 32 L 250 32 L 250 64" 
         fill="none" 
         stroke="var(--red)" 
         strokeWidth="2"
         initial={{ pathLength: 0, opacity: 0 }}
         whileInView={{ pathLength: 1, opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8, delay }}
         style={{ filter: 'drop-shadow(0 0 6px rgba(255,87,26,0.6))' }}
       />
       <motion.path 
         d="M 375 0 L 375 32 L 250 32 L 250 64" 
         fill="none" 
         stroke="var(--red)" 
         strokeWidth="2"
         initial={{ pathLength: 0, opacity: 0 }}
         whileInView={{ pathLength: 1, opacity: 1 }}
         viewport={{ once: true }}
         transition={{ duration: 0.8, delay }}
         style={{ filter: 'drop-shadow(0 0 6px rgba(255,87,26,0.6))' }}
       />
     </svg>
  </div>
);

const ArchitectureSection = () => {
  return (
    <section className="py-24 md:py-32 bg-ink relative overflow-hidden font-mono border-t border-border" id="architecture">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge"
          >
            <Shield className="w-4 h-4" />
            <span>Under The Hood</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-paper leading-[1.05] tracking-[-0.03em] mb-6"
          >
            How Duck Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-paper-dim max-w-2xl mx-auto text-lg"
          >
            A seamless interceptor that adds safety and intelligence to your workflow before Git even knows what happened.
          </motion.p>
        </div>

        <div className="flex flex-col items-center w-full max-w-[1000px] mx-auto relative">
          
          {/* Step 1 */}
          <div className="w-full max-w-[400px]">
             <NodeCard 
               icon={Terminal} 
               title="User Command Input" 
               desc="You run standard commands like duck commit or duck force-push directly in your terminal." 
               delay={0.1} 
             />
          </div>
          
          <VertLine delay={0.3} height="h-16" />
          
          {/* Step 2 */}
          <div className="w-full max-w-[400px]">
             <NodeCard 
               icon={Zap} 
               title="Interceptor Wrapper" 
               desc="Catches the command execution in memory, pausing it to run crucial safety and context checks." 
               delay={0.4} 
             />
          </div>

          <VertLine delay={0.6} height="h-16" />

          {/* Step 3 */}
          <div className="w-full max-w-[400px]">
             <NodeCard 
               icon={Database} 
               title="Context Engine" 
               desc="Analyzes local state, staged files, active branches, and diffs to understand your exact intent." 
               delay={0.7} 
             />
          </div>

          {/* Desktop Split SVG */}
          <SplitLines delay={0.9} />
          {/* Mobile Split replacement */}
          <VertLine height="h-16" delay={0.9} className="md:hidden" />

          {/* Parallel Nodes */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start md:w-[500px] mx-auto gap-8 md:gap-0">
            
            {/* Left Path */}
            <div className="w-full md:w-[250px] flex flex-col items-center">
              <div className="w-full max-w-[240px] h-full">
                <NodeCard 
                  icon={Lock} 
                  title="Security & Safety" 
                  desc="Pre-commit regex scans for leaked secrets and automated generation of backup tags." 
                  delay={1.1} 
                />
              </div>
              <VertLine height="h-16" delay={1.2} className="md:hidden" />
            </div>

            {/* Right Path */}
            <div className="w-full md:w-[250px] flex flex-col items-center">
              <div className="w-full max-w-[240px] h-full">
                <NodeCard 
                  icon={Brain} 
                  title="AI Engine" 
                  desc="Drafts commit messages, spots code ambiguities, and explains merge conflicts clearly." 
                  delay={1.3} 
                />
              </div>
            </div>

          </div>

          {/* Desktop Merge SVG */}
          <MergeLines delay={1.5} />
          {/* Mobile Merge replacement */}
          <VertLine height="h-16" delay={1.5} className="md:hidden" />

          {/* Step 4 */}
          <div className="w-full max-w-[400px]">
             <NodeCard 
               icon={CheckCircle} 
               title="Interactive Review" 
               desc="You review the drafts, answer any AI questions, or confirm safety warnings before proceeding." 
               delay={1.7} 
             />
          </div>

          <VertLine delay={1.9} height="h-16" />

          {/* Step 5 */}
          <div className="w-full max-w-[400px]">
             <NodeCard 
               icon={GitCommit} 
               title="Native Git Execution" 
               desc="Once fully verified, Duck passes the final, safe command directly to Git to execute natively." 
               delay={2.1} 
               isRed={true}
             />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
