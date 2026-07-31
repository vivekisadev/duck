import React from 'react';

const ComparisonSection = () => {
  return (
    <section className="py-16 md:py-24 bg-paper border-b border-ink/10 text-ink">
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-stretch">
          
          {/* Left Text */}
          <div className="flex-1 lg:max-w-[450px] flex flex-col justify-center py-4">
            <h2 className="font-sans text-[clamp(2.5rem,4.5vw,4rem)] font-bold text-ink leading-[1.05] tracking-[-0.03em] mb-8 text-center lg:text-left">
              Git is powerful.<br />It's also unforgiving.
            </h2>
            <p className="text-ink/70 text-sm md:text-[0.95rem] leading-[1.6] mb-6">
              Standard Git assumes you know exactly what you're doing at all times. One wrong command can lead to detached HEADs, lost commits, and hours of recovery.
            </p>
            <p className="text-ink/70 text-sm md:text-[0.95rem] leading-[1.6]">
              Duck CLI wraps Git with a safety net, catching mistakes before they happen and providing clear context so you never fly blind.
            </p>
          </div>

          {/* Right Table */}
          <div className="flex-[1.5] w-full">
            <div className="border border-ink/20 flex flex-col font-sans text-[0.8rem] md:text-[0.9rem] bg-paper">
              
              {/* Header */}
              <div className="flex border-b border-ink/20">
                <div className="flex-1 bg-ink text-paper p-5 md:p-6 text-center border-r border-ink/20 font-mono text-[0.9rem] md:text-base uppercase tracking-wider">
                  Standard Git
                </div>
                <div className="flex-1 bg-red text-ink p-5 md:p-6 text-center font-mono text-[0.9rem] md:text-base font-bold uppercase tracking-wider">
                  With Duck CLI
                </div>
              </div>

              {/* Row 1 */}
              <div className="flex border-b border-ink/20">
                <div className="flex-1 p-5 md:p-8 border-r border-ink/20 flex items-center justify-center text-center text-ink/70">
                  Allows checking out a commit directly, dropping you into a detached HEAD state.
                </div>
                <div className="flex-1 p-5 md:p-8 flex items-center justify-center text-center text-ink font-medium">
                  Warns you and automatically creates a safety branch, preventing lost commits.
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex border-b border-ink/20">
                <div className="flex-1 p-5 md:p-8 border-r border-ink/20 flex items-center justify-center text-center text-ink/70">
                  Force pushing blindly overwrites the remote history with no undo.
                </div>
                <div className="flex-1 p-5 md:p-8 flex items-center justify-center text-center text-ink font-medium">
                  Explains what will be lost and creates a local backup tag before pushing.
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex border-b border-ink/20">
                <div className="flex-1 p-5 md:p-8 border-r border-ink/20 flex items-center justify-center text-center text-ink/70">
                  Merge conflicts present an intimidating wall of `&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD` markers.
                </div>
                <div className="flex-1 p-5 md:p-8 flex items-center justify-center text-center text-ink font-medium">
                  Breaks down conflicts file-by-file, explaining exactly why branches diverged.
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex">
                <div className="flex-1 p-5 md:p-8 border-r border-ink/20 flex items-center justify-center text-center text-ink/70">
                  Happily commits your `.env` file if you accidentally stage it.
                </div>
                <div className="flex-1 p-5 md:p-8 flex items-center justify-center text-center text-ink font-medium">
                  Pre-commit audit blocks commits containing API keys and massive directories.
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
