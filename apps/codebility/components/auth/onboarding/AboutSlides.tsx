"use client";

import { RefObject } from "react";

import AboutUsSlide from "@/components/auth/onboarding/OnboardingAboutUsSlide";
import LaunchpadSlide from "@/components/auth/onboarding/OnboardingLaunchpadSlide";
import MissionVisionSlide from "@/components/auth/onboarding/OnboardingMissionVisionSlide";
import WhyChooseUsSlide from "@/components/auth/onboarding/OnboardingWhyChooseUsSlide";
import type { AboutSlidesProps } from "@/types/auth/onboarding/onboarding";


export default function AboutSlides({ slidesRef }: AboutSlidesProps) {
  return (
    <div
      ref={slidesRef as RefObject<HTMLDivElement>}
      className="flex h-auto transform-gpu flex-col will-change-transform lg:h-full lg:w-[400vw] lg:flex-row"
    >
      <div className="w-full flex-shrink-0 pb-20 lg:min-h-screen lg:w-screen lg:pb-0">
        <AboutUsSlide />
      </div>
      <div className="w-full flex-shrink-0 pb-20 lg:min-h-screen lg:w-screen lg:pb-0">
        <LaunchpadSlide />
      </div>
      <div className="w-full flex-shrink-0 pb-20 lg:min-h-screen lg:w-screen lg:pb-0">
        <MissionVisionSlide />
      </div>
      <div className="w-full flex-shrink-0 pb-20 lg:min-h-screen lg:w-screen lg:pb-0">
        <WhyChooseUsSlide />
      </div>
    </div>
  );
}
