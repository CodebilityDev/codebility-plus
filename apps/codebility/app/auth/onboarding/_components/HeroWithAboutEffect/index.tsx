// HeroWithAboutEffect/index.tsx (patched)

"use client";

import { useRef, useState } from "react";

import useOnboardingAnimations from "../../hooks/useOnboardingAnimations";
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
        className="primary-gradient relative flex items-center justify-center px-10 py-10 text-white lg:h-screen lg:min-h-screen"
      >
        <div className="relative mx-auto flex w-full flex-col items-center justify-start overflow-hidden rounded-3xl bg-gray-950 p-10 lg:h-[calc(100vh-80px)]">
          <BubbleBackground />
          <LottieBackground />
          {/* soft decor glows for dark motif */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_85%_10%,rgba(99,102,241,0.10),transparent_60%),radial-gradient(1100px_560px_at_15%_90%,rgba(124,58,237,0.10),transparent_60%)]" />
          </div>
          <HeroSection h1Ref={h1Ref} />
        </div>
      </section>

      <section
        ref={aboutRef}
        id="about-section"
        className="relative z-10 w-full overflow-hidden bg-white lg:h-screen"
      >
        {/* soft pastel glows for light motif */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_20%,rgba(236,72,153,0.15),transparent_60%),radial-gradient(800px_480px_at_10%_80%,rgba(20,184,166,0.15),transparent_60%)]" />

        <div className="z-10 h-auto w-full lg:sticky lg:top-0 lg:h-screen">
          <AboutSlides slidesRef={slidesRef} />
        </div>
      </section>

      <section ref={regularRef} className="flex h-0"></section>
    </>
  );
}
