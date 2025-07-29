// HeroWithAboutEffect/HeroSection.tsx

import { RefObject } from "react";
import Image from "next/image";

interface HeroSectionProps {
  h1Ref: RefObject<HTMLHeadingElement | null>;
}

export default function HeroSection({ h1Ref }: HeroSectionProps) {
  return (
    <>
      <p
        id="welcome-text"
        className="relative text-[25px] text-[#02e6dd] drop-shadow-[0_0_12px_#02e6dd] lg:-mr-[140px]"
      >
        Welcome to
      </p>

      <h1
        id="codebility-h1"
        ref={h1Ref}
        className="relative z-[999999] -mr-[140px] mt-16 hidden text-[91px] lg:flex"
      >
        <span id="co" className="flex">
          {"Co".split("").map((c, i) => (
            <span key={`co-${i}`} className="letter-co inline-block">
              {c}
            </span>
          ))}
        </span>

        <span
          id="d"
          className="inline-block opacity-0 transition-all duration-300"
        >
          d
        </span>

        <span id="ebility" className="flex">
          {"ebility".split("").map((c, i) => (
            <span key={`eb-${i}`} className="letter-eb inline-block">
              {c}
            </span>
          ))}
        </span>
      </h1>

      <div className="mt-10 flex items-center justify-center lg:hidden">
        <span className=" -mr-4 text-[clamp(32px,10vw,48px)] text-white">
          Co
        </span>
        <Image
          src="/assets/images/onboarding/code_logo.svg"
          alt="d"
          width={66}
          height={66}
          className="object-contain"
        />
        <span className="-ml-4 text-[clamp(32px,10vw,48px)] text-white">
          ebility
        </span>
      </div>

      {/* Grouped h2 and button centered between h1 and bottom */}
      <div className="pointer-events-none inset-0 mt-10 flex flex-col items-center justify-between lg:absolute lg:mt-0">
        <div className="hidden pt-[260px] lg:block" />
        <div className="pointer-events-auto z-[999] flex flex-col items-center space-y-10 lg:-mr-[140px]">
          <h2
            id="codebility-h2"
            className="z-10 text-center text-[clamp(32px,5vw,64px)] text-[#02e6dd] drop-shadow-[0_0_12px_#02e6dd] 2xl:text-[64px]"
          >
            Everyone has the ability to code
          </h2>
          <button
            id="codebility-btn"
            className="group relative flex items-center justify-center overflow-hidden rounded-full bg-orange-500 px-8 py-2 text-white transition-all duration-300"
            style={{
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 20px #02e6dd, 0 0 40px #02e6dd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Expanding Purple Circle */}
            <span
              className="absolute left-4 top-1/2 z-10 h-3 w-3 -translate-y-1/2 rounded-full bg-[#8c52ff] transition-all duration-300 ease-in-out
      group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:translate-y-0 group-hover:rounded-none"
            />

            {/* Text */}
            <span className="relative z-30 px-6">About</span>

            {/* Arrow Icon */}
            <span className="absolute right-4 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              →
            </span>
          </button>
        </div>
        <div className="hidden pb-10 lg:block" />
      </div>

      {/* Left image */}
      <div
        className="absolute left-0 top-1/2 hidden -translate-y-1/2 "
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
        className="absolute right-0 top-1/2 hidden -translate-y-1/2"
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
