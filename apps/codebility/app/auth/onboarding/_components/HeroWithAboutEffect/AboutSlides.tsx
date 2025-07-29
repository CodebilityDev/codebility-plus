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
      <div className="w-full flex-shrink-0 lg:min-h-screen lg:w-screen">
        <AboutUsSlide />
      </div>
      <div className="w-full flex-shrink-0 lg:min-h-screen lg:w-screen">
        <LaunchpadSlide />
      </div>
      <div className="w-full flex-shrink-0 lg:min-h-screen lg:w-screen">
        <MissionVisionSlide />
      </div>
      <div className="w-full flex-shrink-0 lg:min-h-screen lg:w-screen">
        <WhyChooseUsSlide />
      </div>
    </div>
  );
}
