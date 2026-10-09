"use client";





import ProgressiveMotion from "@/components/global/marketing/ProgressiveMotion";
import { LandingWorkWithUsSkeleton } from "@/components/marketing/LandingWorkWithUsSkeleton";
import { WorkWithUsCard } from "@/components/marketing/WorkWithUsCard";
import { WorkWithUsWORK_WITH_US_CARDS } from "@/constants/marketing/marketing";


const WorkWithUs = () => {
  return (
    <section
      id="workwithus"
      className="relative flex w-full items-center overflow-hidden py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute left-0 top-16 hidden h-64 w-64 rounded-full bg-purple-600/30 blur-3xl md:block"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div data-landing-section className="relative z-10 w-full">
        <div data-landing-skeleton>
          <LandingWorkWithUsSkeleton />
        </div>
        <div data-landing-content>
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 text-white md:px-6 lg:px-8">
            <ProgressiveMotion
              className="flex w-full max-w-4xl flex-col items-center gap-6 text-center md:gap-8"
              y={32}
              duration={0.6}
              staggerChildren={0.12}
            >
          <span
            data-progressive-child
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200"
          >
            Work With Us
          </span>
          <h2
            data-progressive-child
            className="text-3xl font-semibold leading-tight md:text-4xl"
          >
            Build meaningful products with a partner that keeps momentum high.
          </h2>
          <p
            data-progressive-child
            className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base"
          >
            Whether you need a seasoned project team, specialist talent, or a
            launchpad for your own journey, Codebility brings world-class
            execution, mentorship, and community to every collaboration.
          </p>
        </ProgressiveMotion>

            <ProgressiveMotion
              className="mt-14 grid w-full grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-10 lg:gap-12"
              y={32}
              duration={0.6}
              staggerChildren={0.15}
            >
              {WorkWithUsWORK_WITH_US_CARDS.map((card, index) => (
                <WorkWithUsCard key={card.id} card={card} index={index} />
              ))}
            </ProgressiveMotion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkWithUs;
