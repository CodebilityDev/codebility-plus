"use client";

import SectionWrapper from "@/components/global/typography/SectionWrapper";


import MarketingProgressiveSection from "@/components/global/marketing/MarketingProgressiveSection";
import ProgressiveMotion from "@/components/global/marketing/ProgressiveMotion";
import { CareerGrowthCard } from "@/components/marketing/careers/CareerGrowthCard";
import { careerPaths } from "@/constants/marketing/careers/careers";


const CareerGrowthPath = () => {
  const skeleton = (
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200">
          Career Growth
        </span>
        <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
          Your Professional Journey
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-gray-400">
          We believe in nurturing talent and providing clear paths for career
          advancement. Join us and grow from junior developer to technical
          leader.
        </p>
      </div>
      <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
        {careerPaths.map((path, index) => (
          <CareerGrowthCard key={path.id} path={path} index={index} />
        ))}
      </div>
    </div>
  );

  return (
    <SectionWrapper id="career-growth" className="w-full py-20">
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="mx-auto max-w-7xl px-6">
          <ProgressiveMotion
            className="mb-12 text-center"
            y={30}
            duration={0.6}
            staggerChildren={0.12}
          >
            <span
              data-progressive-child
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200"
            >
              Career Growth
            </span>
            <h2
              data-progressive-child
              className="mb-4 text-4xl font-light tracking-tight text-white"
            >
              Your Professional Journey
            </h2>
            <p
              data-progressive-child
              className="mx-auto max-w-3xl text-lg text-gray-400"
            >
              We believe in nurturing talent and providing clear paths for career
              advancement. Join us and grow from junior developer to technical
              leader.
            </p>
          </ProgressiveMotion>

          <ProgressiveMotion
            className="hidden lg:grid lg:grid-cols-4 lg:gap-8"
            y={30}
            duration={0.55}
            staggerChildren={0.1}
          >
            {careerPaths.map((path, index) => (
              <div key={path.id} data-progressive-child>
                <CareerGrowthCard path={path} index={index} />
              </div>
            ))}
          </ProgressiveMotion>

          <ProgressiveMotion
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:hidden"
            y={30}
            duration={0.55}
            staggerChildren={0.08}
          >
            {careerPaths.map((path, index) => (
              <div key={path.id} data-progressive-child>
                <CareerGrowthCard path={path} index={index} />
              </div>
            ))}
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mt-12 text-center"
            y={24}
            duration={0.5}
            staggerChildren={0.1}
          >
            <p data-progressive-child className="mb-4 text-gray-300">
              Ready to take the next step in your career?
            </p>
            <button
              data-progressive-child
              type="button"
              onClick={() => {
                document.getElementById("open-positions")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              className="inline-flex items-center justify-center rounded-full border border-customViolet-100/20 bg-customViolet-100/10 px-6 py-3 text-sm font-medium text-customViolet-100 transition-all hover:border-customViolet-100/40 hover:bg-customViolet-100/20"
            >
              Explore Open Positions
            </button>
          </ProgressiveMotion>
        </div>
      </MarketingProgressiveSection>
    </SectionWrapper>
  );
};

export default CareerGrowthPath;
