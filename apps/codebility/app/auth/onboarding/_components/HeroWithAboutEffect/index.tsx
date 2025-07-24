// HeroWithAboutEffect/index.tsx

"use client";

import { useRef, useState } from "react";

import { BubbleBackground } from "../BubbleBackground";
import AboutSlides from "./AboutSlides";
import HeroSection from "./HeroSection";
import { useHeroAnimations } from "./hooks/useHeroAnimations";
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
    <main className="relative overflow-hidden">
      {/* Sticky Logo */}
      <StickyLogo logoRef={logoRef} isVisible={isLogoVisible} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex h-screen items-center justify-center bg-gradient-to-br from-[#017780] via-[#441e70] to-[#130a3d] px-10 text-white"
      >
        <div className="relative mx-auto flex h-[calc(100vh-80px)] w-full flex-col items-center justify-start overflow-hidden rounded-3xl bg-[#130a3d]/80 p-10">
          <BubbleBackground />
          <HeroSection h1Ref={h1Ref} />
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="h-[100vh] bg-black text-white"
        id="about-section"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <AboutSlides slidesRef={slidesRef} />
        </div>
      </section>

      {/* Regular Section */}
      <section
        ref={regularRef}
        className="flex h-screen items-center justify-center bg-white text-black"
      >
        <h1>Regular Section</h1>
      </section>
    </main>
  );
}
