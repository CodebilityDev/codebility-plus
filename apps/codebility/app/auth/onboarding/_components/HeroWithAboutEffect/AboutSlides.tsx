// AboutSlides.tsx

"use client";

import { RefObject } from "react";

import AboutUsSlide from "./Slides/AboutUs";
import LaunchpadSlide from "./Slides/Launchpad";
import MissionVisionSlide from "./Slides/MissionVisionSlide";
import WhyChooseUsSlide from "./Slides/WhyChooseUsSlide";

interface AboutSlidesProps {
  slidesRef: RefObject<HTMLDivElement | null>;
}

export default function AboutSlides({ slidesRef }: AboutSlidesProps) {
  return (
    <div
      ref={slidesRef}
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
