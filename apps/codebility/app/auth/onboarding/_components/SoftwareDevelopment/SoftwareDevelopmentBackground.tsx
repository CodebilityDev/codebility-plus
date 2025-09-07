// SoftwareDevelopmentBackground.tsx
"use client";

import devAnimation from "@/public/assets/images/onboarding/animation/dev-coding.json";
import Lottie from "lottie-react";

export default function SoftwareDevelopmentBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Lottie on the right */}
      <div
        className="absolute right-0 top-1/2 hidden w-[50%] max-w-[600px] -translate-y-1/2 lg:block"
        aria-hidden="true"
      >
        <Lottie animationData={devAnimation} loop autoplay />
      </div>
    </div>
  );
}
