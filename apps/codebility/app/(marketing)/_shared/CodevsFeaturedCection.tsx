"use client";

import Link from "next/link";
import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import { Button } from "@/components/ui/button";

import { FeaturedSectiondata } from "@/constants/landing_data";
import FeaturedCard from "./CodevsFeaturedCard";
import MarketingProgressiveSection from "./MarketingProgressiveSection";
import ProgressiveMotion from "./ProgressiveMotion";
import Section from "./CodevsSection";

export const inter = { className: "font-sans" };
export const outfit = { className: "font-sans" };

const FeaturedSection = () => {
  const skeleton = (
    <div className="relative flex flex-col gap-4">
      <div className="flex flex-col">
        <div className="mx-auto">
          <H2 className={`${inter.className} text-edit`}>WHO WE ARE</H2>
        </div>
        <div className="text-gray mx-auto max-w-[650px] text-center">
          <Heading3>At Codebility we&apos;re</Heading3>
          <H2 className={`${outfit.className} text-white`}>
            MORE THAN JUST A COMMUNITY
          </H2>
        </div>
      </div>
      <div className="mt-10 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-5">
        {FeaturedSectiondata.map((data, index) => (
          <FeaturedCard
            key={index}
            title={data.title}
            description={data.description}
            src={data.src}
            alt={data.alt}
          />
        ))}
      </div>
    </div>
  );

  return (
    <Section id="whoweare" className="relative mx-0">
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="relative flex flex-col gap-4">
          <ProgressiveMotion className="flex flex-col" y={30} duration={0.6} staggerChildren={0.12}>
            <div data-progressive-child className="mx-auto">
              <H2 className={`${inter.className} text-edit`}>WHO WE ARE</H2>
            </div>
            <div
              data-progressive-child
              className="text-gray mx-auto max-w-[650px] text-center"
            >
              <Heading3>At Codebility we&apos;re</Heading3>
              <H2 className={`${outfit.className} text-white`}>
                MORE THAN JUST A COMMUNITY
              </H2>
            </div>
          </ProgressiveMotion>

          <ProgressiveMotion
            className="mt-10 grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-5"
            y={24}
            duration={0.55}
            staggerChildren={0.08}
          >
            {FeaturedSectiondata.map((data, index) => (
              <div key={index} data-progressive-child>
                <FeaturedCard
                  title={data.title}
                  description={data.description}
                  src={data.src}
                  alt={data.alt}
                />
              </div>
            ))}
          </ProgressiveMotion>

          <ProgressiveMotion className="mx-auto mt-10" y={20} duration={0.5}>
            <div data-progressive-child>
              <Link href="#roadmap">
                <Button variant="purple" size="lg" rounded="full">
                  See how we started
                </Button>
              </Link>
            </div>
          </ProgressiveMotion>
        </div>
      </MarketingProgressiveSection>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl sm:block"
      >
        <div
          style={{
            width: "500.12px",
            height: "468.25px",
            left: "586.13px",
            top: "1816.14px",
          }}
          className="aspect-[855/678] w-[40rem] bg-customBlue-100 opacity-15 sm:w-[72.1875rem]"
        />
      </div>
    </Section>
  );
};

export default FeaturedSection;
