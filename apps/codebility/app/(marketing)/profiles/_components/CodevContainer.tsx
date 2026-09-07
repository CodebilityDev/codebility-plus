"use client";

import H2 from "@/components/shared/home/H2";

import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../_shared/ProgressiveMotion";

export default function CodevContainer() {
  const skeleton = (
    <div className="relative flex flex-col gap-6">
      <div className="relative z-10 mx-auto">
        <H2 className="text-white drop-shadow-lg">Our Skilled Network</H2>
      </div>
      <div className="relative z-10 mx-auto max-w-auto px-6 py-2 text-center shadow-xl backdrop-blur-sm">
        <p className="text-2xl leading-relaxed text-gray-200">
          Discover our carefully vetted professionals, ready to join your team
          and deliver exceptional results. Every member brings proven expertise,
          strong communication, and a passion for getting things done right.
        </p>
      </div>
    </div>
  );

  return (
    <MarketingProgressiveSection skeleton={skeleton}>
      <ProgressiveMotion
        className="relative flex flex-col gap-6"
        y={30}
        duration={0.6}
        staggerChildren={0.12}
      >
        <div data-progressive-child className="relative z-10 mx-auto">
          <H2 className="text-white drop-shadow-lg">Our Skilled Network</H2>
        </div>
        <div
          data-progressive-child
          className="relative z-10 mx-auto max-w-auto px-6 py-2 text-center shadow-xl backdrop-blur-sm"
        >
          <p className="text-2xl leading-relaxed text-gray-200">
            Discover our carefully vetted professionals, ready to join your team
            and deliver exceptional results. Every member brings proven
            expertise, strong communication, and a passion for getting things
            done right.
          </p>
        </div>
      </ProgressiveMotion>
    </MarketingProgressiveSection>
  );
}
