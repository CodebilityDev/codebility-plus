"use client";

import React, { forwardRef, useRef } from "react";

import useOnboardingAnimations from "../../hooks/useOnboardingAnimations";
import AnimatedRoadmapWrapper from "./AnimatedRoadmapWrapper";

type Props = React.HTMLAttributes<HTMLDivElement>;

const IsRoadMap = forwardRef<HTMLDivElement, Props>(function IsRoadMap(
  { className = "", ...rest },
  roadmapRef,
) {
  // Keep existing hero/about/regular refs — unchanged
  const heroRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<HTMLDivElement | null>(null);
  const regularRef = useRef<HTMLDivElement | null>(null);
  const h1Ref = useRef<HTMLHeadingElement | null>(null);

  const setIsLogoVisible = (_: boolean) => {};

  useOnboardingAnimations({
    heroRef,
    logoRef,
    aboutRef,
    slidesRef,
    regularRef,
    h1Ref,
    roadmapRef: roadmapRef as React.RefObject<HTMLDivElement | null>,
    setIsLogoVisible,
  });

  return (
    <section
      ref={roadmapRef}
      className={`relative w-full overflow-hidden bg-[#111111] lg:min-h-screen ${className}`}
      // style={{
      //   backgroundImage: "url('/assets/images/onboarding/roadmap_bg.svg')",
      // }}
      {...rest}
    >
      {/* soft decor glows for dark theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-44 top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="from-black-500 absolute bottom-0 left-1/2 h-40 w-[120%] -translate-x-1/2 bg-gradient-to-t to-transparent" />
      </div>

      <AnimatedRoadmapWrapper />
    </section>
  );
});

export default IsRoadMap;
