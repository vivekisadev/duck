import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import ProblemSection from '../components/sections/ProblemSection';
import ComparisonSection from '../components/sections/ComparisonSection';
import LocalFirstSection from '../components/sections/LocalFirstSection';
import OfflineGlobeSection from '../components/sections/OfflineGlobeSection';
import ThreeColDetailsSection from '../components/sections/ThreeColDetailsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TerminalSection from '../components/sections/TerminalSection';
import BentoSection from '../components/sections/BentoSection';
import FAQSection from '../components/sections/FAQSection';
import ArchitectureSection from '../components/sections/ArchitectureSection';
import CTASection from '../components/sections/CTASection';

const Home = ({ SectionSeparator }) => {
  return (
    <>
      <HeroSection />
      <main className="w-full relative z-10 pt-16">
        <ProblemSection />
        <SectionSeparator />
        <ComparisonSection />
        <SectionSeparator />
        <LocalFirstSection />
        <SectionSeparator />
        <OfflineGlobeSection />
        {/* No separator here because RigThreeColDetails is a continuation of features */}
        <ThreeColDetailsSection />
        <SectionSeparator />
        <HowItWorksSection />
        <SectionSeparator />
        <TerminalSection />
        <SectionSeparator />
        <BentoSection />
      </main>
      <SectionSeparator />
      <FAQSection />
      <SectionSeparator />
      <ArchitectureSection />
      <SectionSeparator />
      <CTASection />
      <SectionSeparator />
    </>
  );
};

export default Home;
