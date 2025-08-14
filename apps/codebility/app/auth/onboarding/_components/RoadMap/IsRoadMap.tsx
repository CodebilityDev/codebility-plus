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
      className={`relative w-full bg-cover bg-center bg-no-repeat lg:min-h-screen ${className}`}
      style={{
        backgroundImage: "url('/assets/images/onboarding/roadmap_bg.svg')",
      }}
      {...rest}
    >
      <AnimatedRoadmapWrapper />
    </section>
  );
});

export default IsRoadMap;
