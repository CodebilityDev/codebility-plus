"use client";

import H2 from "@/components/shared/home/H2";
import Heading3 from "@/components/shared/home/Heading3";
import IntroText from "@/components/shared/home/IntroText";

import MarketingProgressiveSection from "./MarketingProgressiveSection";
import ProgressiveMotion from "./ProgressiveMotion";

export default function CodevsProfilesContainer() {
  const skeleton = (
    <div className="flex flex-col gap-4">
      <div className="mx-auto">
        <H2 className="text-white">Meet Our CoDevs</H2>
      </div>
      <div className="text-gray mx-auto max-w-[650px] text-center">
        <Heading3>See Who You&apos;ll Be Working With</Heading3>
        <IntroText>
          Get inspired by our current CoDevs who started their journey just like
          you. These talented developers have grown their skills through
          real-world projects and are now contributing to amazing products
          worldwide.
        </IntroText>
      </div>
    </div>
  );

  return (
    <MarketingProgressiveSection skeleton={skeleton}>
      <ProgressiveMotion
        className="flex flex-col gap-4"
        y={30}
        duration={0.6}
        staggerChildren={0.12}
      >
        <div data-progressive-child className="mx-auto">
          <H2 className="text-white">Meet Our CoDevs</H2>
        </div>
        <div
          data-progressive-child
          className="text-gray mx-auto max-w-[650px] text-center"
        >
          <Heading3>See Who You&apos;ll Be Working With</Heading3>
          <IntroText>
            Get inspired by our current CoDevs who started their journey just
            like you. These talented developers have grown their skills through
            real-world projects and are now contributing to amazing products
            worldwide.
          </IntroText>
        </div>
      </ProgressiveMotion>
    </MarketingProgressiveSection>
  );
}
