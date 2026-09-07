"use client";

import type { EmblaOptionsType } from "embla-carousel";

import MarketingProgressiveSection from "./MarketingProgressiveSection";
import ProgressiveMotion from "./ProgressiveMotion";
import EmblaCarousel from "./CodevsCarousel";
import Section from "./CodevsSection";

type Props = {
  slides: string[];
  options: EmblaOptionsType;
};

export function CodevsFeaturedProjectsAnimated({ slides, options }: Props) {
  const skeleton = (
    <>
      <div className="mb-10 space-y-2">
        <h1 className="text-2xl font-bold uppercase tracking-[0.7em] text-white lg:text-4xl">
          Our Featured
        </h1>
        <p className="text-customTeal text-lg font-bold lg:text-2xl">internal</p>
        <h1 className="text-3xl font-normal uppercase -tracking-widest text-white lg:text-5xl">
          Projects
        </h1>
      </div>
      {slides.length > 0 ? (
        <EmblaCarousel slides={slides} options={options} />
      ) : (
        <div className="flex flex-col items-center justify-center text-white">
          <p className="mb-2">No projects available</p>
        </div>
      )}
    </>
  );

  return (
    <Section className="bg-black-400 relative mt-10 flex w-full flex-col justify-center text-center">
      <MarketingProgressiveSection skeleton={skeleton}>
        <ProgressiveMotion
          className="mb-10 space-y-2"
          y={30}
          duration={0.6}
          staggerChildren={0.1}
        >
          <h1
            data-progressive-child
            className="text-2xl font-bold uppercase tracking-[0.7em] text-white lg:text-4xl"
          >
            Our Featured
          </h1>
          <p
            data-progressive-child
            className="text-customTeal text-lg font-bold lg:text-2xl"
          >
            internal
          </p>
          <h1
            data-progressive-child
            className="text-3xl font-normal uppercase -tracking-widest text-white lg:text-5xl"
          >
            Projects
          </h1>
        </ProgressiveMotion>

        <ProgressiveMotion y={24} duration={0.55}>
          <div data-progressive-child>
            {slides.length > 0 ? (
              <EmblaCarousel slides={slides} options={options} />
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                <p className="mb-2">No projects available</p>
              </div>
            )}
          </div>
        </ProgressiveMotion>
      </MarketingProgressiveSection>
    </Section>
  );
}
