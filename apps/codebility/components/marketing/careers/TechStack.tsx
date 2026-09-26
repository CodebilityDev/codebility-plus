"use client";

import H2 from "@/components/global/typography/H2";
import Heading3 from "@/components/global/typography/Heading3";

import MarketingProgressiveSection from "@/components/global/marketing/MarketingProgressiveSection";
import ProgressiveMotion from "@/components/global/marketing/ProgressiveMotion";
import Section from "@/components/global/marketing/CodevsSection";
import { TechCategoryCard } from "@/components/marketing/careers/TechCategoryCard";
import { inter, outfit, techCategories } from "@/constants/marketing/careers/careers";


const TechStack = () => {
  const skeleton = (
    <div className="relative flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="mx-auto">
          <H2 className={`${inter.className} text-edit`}>TECH STACK</H2>
        </div>
        <div className="text-gray mx-auto max-w-[650px] text-center">
          <Heading3>Work with the latest</Heading3>
          <H2 className={`${outfit.className} text-white`}>
            CUTTING-EDGE TECHNOLOGIES
          </H2>
        </div>
      </div>
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {techCategories.map((category) => (
          <TechCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );

  return (
    <Section id="tech-stack" className="relative mx-0">
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="relative flex flex-col gap-4">
          <ProgressiveMotion
            className="flex flex-col"
            y={30}
            duration={0.6}
            staggerChildren={0.12}
          >
            <div data-progressive-child className="mx-auto">
              <H2 className={`${inter.className} text-edit`}>TECH STACK</H2>
            </div>
            <div
              data-progressive-child
              className="text-gray mx-auto max-w-[650px] text-center"
            >
              <Heading3>Work with the latest</Heading3>
              <H2 className={`${outfit.className} text-white`}>
                CUTTING-EDGE TECHNOLOGIES
              </H2>
            </div>
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-3"
            y={30}
            duration={0.55}
            staggerChildren={0.08}
          >
            {techCategories.map((category) => (
              <div key={category.id} data-progressive-child>
                <TechCategoryCard category={category} />
              </div>
            ))}
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mx-auto mt-12 max-w-3xl text-center"
            y={24}
            duration={0.5}
            staggerChildren={0.1}
          >
            <p data-progressive-child className="mb-4 text-gray-300">
              Join our team and work with modern, industry-standard technologies.
              We continuously invest in the latest tools and frameworks to ensure
              our developers have the best resources to build exceptional software.
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
              Find Your Next Role
            </button>
          </ProgressiveMotion>
        </div>
      </MarketingProgressiveSection>
    </Section>
  );
};

export default TechStack;
