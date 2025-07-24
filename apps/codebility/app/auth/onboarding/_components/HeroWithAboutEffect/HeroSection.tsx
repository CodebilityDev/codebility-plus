// HeroWithAboutEffect/HeroSection.tsx

import { RefObject } from "react";
import Image from "next/image";

interface HeroSectionProps {
  h1Ref: RefObject<HTMLHeadingElement | null>;
}

export default function HeroSection({ h1Ref }: HeroSectionProps) {
  return (
    <>
      <p id="welcome-text" className="relative -mr-[140px] text-4xl">
        Welcome to
      </p>

      <h1
        id="codebility-h1"
        ref={h1Ref}
        className="relative z-[999999] -mr-[140px] mt-16 text-[91px]"
      >
        <span id="co">Co</span>
        <span
          id="d"
          className="inline-block px-[10px] opacity-0 transition-all duration-300"
        >
          d
        </span>
        <span id="ebility">ebility</span>
      </h1>

      {/* Grouped h2 and button centered between h1 and bottom */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between">
        <div className="pt-[260px]" />
        <div className="pointer-events-auto z-[999] -mr-[140px] flex flex-col items-center space-y-4">
          <h2
            id="codebility-h2"
            className="z-10 text-center text-[50px] 2xl:text-[64px]"
          >
            Everyone has the ability to code
          </h2>
          <button
            id="codebility-btn"
            className="rounded-full bg-red-600 px-6 py-2 text-white transition duration-300 hover:scale-105 hover:bg-red-500"
          >
            About
          </button>
        </div>
        <div className="pb-10" />
      </div>

      {/* Left image */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        id="hero-left-img"
      >
        <div className="relative h-[574px] w-[440px]">
          <Image
            src="/assets/images/onboarding/hero1.svg"
            alt="Hero Left"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Right image */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        id="hero-right-img"
      >
        <div className="relative h-[340px] w-[276px]">
          <Image
            src="/assets/images/onboarding/hero2.svg"
            alt="Hero Right"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
