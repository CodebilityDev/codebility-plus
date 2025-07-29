// HeroWithAboutEffect/index.tsx

"use client";

import { useRef, useState } from "react";

import AboutSlides from "./AboutSlides";
import { BubbleBackground } from "./BubbleBackground";
import { FloatingCodeTags } from "./FloatingCodeTags";
import HeroSection from "./HeroSection";
import { useHeroAnimations } from "./hooks/useHeroAnimations";
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

  useHeroAnimations({
    heroRef: heroRef as React.RefObject<HTMLDivElement>,
    logoRef: logoRef as React.RefObject<HTMLDivElement>,
    aboutRef: aboutRef as React.RefObject<HTMLDivElement>,
    slidesRef: slidesRef as React.RefObject<HTMLDivElement>,
    regularRef: regularRef as React.RefObject<HTMLDivElement>,
    h1Ref: h1Ref as React.RefObject<HTMLHeadingElement>,
    setIsLogoVisible,
  });

  return (
    <>
      {/* Sticky Logo */}
      <StickyLogo logoRef={logoRef} isVisible={isLogoVisible} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#017780] via-[#441e70] to-[#130a3d] px-10 py-10 text-white lg:h-screen"
      >
        <div className="relative mx-auto flex w-full flex-col items-center justify-start overflow-hidden rounded-3xl bg-[#130a3d]/80 p-10 lg:h-[calc(100vh-80px)]">
          <BubbleBackground />
          <FloatingCodeTags />
          <LottieBackground />
          <HeroSection h1Ref={h1Ref} />
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        id="about-section"
        className="relative z-10 w-full overflow-hidden bg-black text-white lg:h-screen"
      >
        <div className="h-auto w-full lg:sticky lg:top-0 lg:h-screen">
          <AboutSlides slidesRef={slidesRef} />
        </div>
      </section>

      {/* Regular Section */}
      <section ref={regularRef} className="flex h-0"></section>
    </>
  );
}
