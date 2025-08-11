// HeroWithAboutEffect/index.tsx (patched)

"use client";

import { useRef, useState } from "react";

import { useOnboardingAnimations } from "../../hooks/useOnboardingAnimations";
import AboutSlides from "./AboutSlides";
import { BubbleBackground } from "./BubbleBackground";
import { FloatingCodeTags } from "./FloatingCodeTags";
import HeroSection from "./HeroSection";
import LottieBackground from "./LottieBackground";
import StickyLogo from "./StickyLogo";

export default function HeroWithAboutEffect() {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const regularRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  const [isLogoVisible, setIsLogoVisible] = useState(true);

  useOnboardingAnimations({
    heroRef,
    logoRef,
    aboutRef,
    slidesRef,
    regularRef,
    h1Ref,
    setIsLogoVisible,
  });

  return (
    <>
      <StickyLogo logoRef={logoRef} isVisible={isLogoVisible} />

      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#017780] via-[#441e70] to-[#130a3d] px-10 py-10 text-white lg:h-screen"
      >
        <div className="relative mx-auto flex w-full flex-col items-center justify-start overflow-hidden rounded-3xl bg-[#130a3d]/80 p-10 lg:h-[calc(100vh-80px)]">
          <HeroSection h1Ref={h1Ref} />
        </div>
      </section>

      <section
        ref={aboutRef}
        id="about-section"
        className="relative z-10 w-full overflow-hidden bg-black text-white lg:h-screen"
      >
        <div className="h-auto w-full lg:sticky lg:top-0 lg:h-screen">
          <AboutSlides slidesRef={slidesRef} />
        </div>
      </section>

      <section ref={regularRef} className="flex h-0"></section>
    </>
  );
}
