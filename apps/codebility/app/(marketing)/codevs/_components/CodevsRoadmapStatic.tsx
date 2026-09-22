import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../_shared/ProgressiveMotion";

import { roadmapData } from "@/constants/codevs/roadmap-data";
import CodevsRoadmapPhases from "./CodevsRoadmapPhases";

const CodevsRoadmapStatic = () => {
  const skeleton = (
    <>
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
          Career Progression Roadmap
        </h2>
        <p className="text-lg text-gray-400">
          Your Journey from Intern to Mentor at Codebility
        </p>
      </div>
      <div className="relative mx-auto max-w-4xl">
        {roadmapData.map((phase) => (
          <div
            key={phase.id}
            className="relative mb-16 rounded-xl border border-gray-800 bg-gray-900/50 p-6 md:mb-24"
          >
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400">
              {phase.phase}
            </h3>
            <h2 className="text-3xl font-bold text-white">{phase.title}</h2>
            <p className="mt-1 text-sm font-semibold text-gray-400">
              {phase.pointsRange}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section id="roadmap" className="w-full py-20">
      <div className="mx-auto max-w-screen-xl px-4">
        <MarketingProgressiveSection skeleton={skeleton}>
          <ProgressiveMotion
            className="mb-12 text-center"
            y={30}
            duration={0.6}
            staggerChildren={0.1}
          >
            <h2
              data-progressive-child
              className="mb-4 text-4xl font-bold text-white md:text-5xl"
            >
              Career Progression Roadmap
            </h2>
            <p data-progressive-child className="text-lg text-gray-400">
              Your Journey from Intern to Mentor at Codebility
            </p>
          </ProgressiveMotion>

          <ProgressiveMotion
            className="relative mx-auto max-w-4xl"
            y={24}
            duration={0.55}
            staggerChildren={0.1}
          >
            <div data-progressive-child>
              <CodevsRoadmapPhases />
            </div>
          </ProgressiveMotion>

          <ProgressiveMotion className="mt-8 text-center" y={20} duration={0.5}>
            <p data-progressive-child className="text-sm text-gray-400">
              Click on any phase card to learn more about the rewards and
              progression
            </p>
          </ProgressiveMotion>
        </MarketingProgressiveSection>
      </div>
    </section>
  );
};

export default CodevsRoadmapStatic;
