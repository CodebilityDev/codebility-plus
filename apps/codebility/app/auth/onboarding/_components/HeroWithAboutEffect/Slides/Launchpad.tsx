// components/HeroWithAboutEffect/LaunchpadSlide.tsx

"use client";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LaunchpadSlide() {
  return (
    <div className="slide relative flex lg:h-screen w-screen items-center justify-center">
      {/* Background Lottie */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <Lottie
          animationData={require("@/public/assets/images/onboarding/animation/web-development.json")}
          loop
          autoplay
          className="h-full w-full object-cover"
        />
      </div>

      {/* Centered Text */}
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold leading-tight text-stone-900 sm:text-4xl md:text-5xl lg:text-6xl">
          It’s not a course—it’s a launchpad.
        </h2>
        <p className="mt-6 text-xl font-medium text-stone-900 sm:text-2xl">
          You learn by doing, by helping, and by being part of something bigger.
        </p>
      </div>
    </div>
  );
}
