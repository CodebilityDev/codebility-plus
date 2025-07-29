// SoftwareDevelopmentBackground.tsx
"use client";

import devAnimation from "@/public/assets/images/onboarding/animation/dev-coding.json";
import Lottie from "lottie-react";

export default function SoftwareDevelopmentBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Optional grid background */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#6b21a8"
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

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
