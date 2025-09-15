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
        className="relative text-[32px] text-[#02e6dd] drop-shadow-[0_0_16px_#02e6dd] lg:-mr-[140px] lg:text-[40px]"
      >
        Welcome to
      </p>

      <h1
        id="codebility-h1"
        ref={h1Ref}
        className="relative z-[999999] -mr-[140px] mt-16 hidden text-[120px] lg:flex 2xl:text-[140px]"
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

      <div className="z-[999] mt-10 flex items-center justify-center lg:hidden">
        <span className="text-[clamp(40px,12vw,60px)] text-white leading-none">
          Co
        </span>
        <div className="mx-1 flex items-center justify-center">
          <Image
            src="/assets/images/onboarding/code_logo.svg"
            alt="d"
            width={66}
            height={66}
            className="object-contain translate-y-[-2px]"
          />
        </div>
        <span className="text-[clamp(40px,12vw,60px)] text-white leading-none">
          ebility
        </span>
      </div>

      {/* Grouped h2 and button centered between h1 and bottom */}
      <div className="pointer-events-none inset-0 mt-12 flex flex-col items-center justify-between lg:absolute lg:mt-0">
        <div className="hidden pt-[300px] lg:block" />
        <div className="pointer-events-auto z-[999] flex flex-col items-center space-y-12 lg:-mr-[140px]">
          <h2
            id="codebility-h2"
            className="z-10 text-center text-[clamp(36px,6vw,80px)] font-medium text-white drop-shadow-[0_0_2px_#fff] 2xl:text-[80px]"
          >
            Everyone has the ability to code
          </h2>
          <button
            id="codebility-btn"
            type="button"
            onClick={() =>
              document
                .getElementById("about-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="
    group relative inline-flex items-center justify-center overflow-hidden
    rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500
    px-10 py-4 text-lg font-semibold text-white
    shadow-[0_12px_40px_-12px_rgba(168,85,247,0.45)]
    transition-all duration-300
    hover:brightness-[1.05]
    focus:outline-none
    focus:ring-2 focus:ring-cyan-400/60 active:scale-[0.98]
  "
          >
            {/* Button text */}
            <span className="relative z-10 px-6">About Us</span>

            {/* Arrow (reveals on hover) */}
            <span
              className="
      absolute right-4 z-10 translate-x-1 opacity-0
      transition-all duration-300
      group-hover:translate-x-0 group-hover:opacity-100
    "
              aria-hidden
            >
              →
            </span>

            {/* subtle glow ring */}
            <span
              className="pointer-events-none absolute inset-0 -z-0 rounded-full ring-1 ring-white/20"
              aria-hidden
            />

            {/* animated shine sweep */}
            <span
              className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-full"
              aria-hidden
            >
              <span
                className="
        absolute -left-1/3 top-0 h-full w-1/3 translate-x-0 skew-x-[-12deg]
        bg-white/25 blur-md
        transition-transform duration-700
        group-hover:translate-x-[350%]
      "
              />
            </span>
          </button>
        </div>
        <div className="hidden pb-10 lg:block" />
      </div>
    </>
  );
}
