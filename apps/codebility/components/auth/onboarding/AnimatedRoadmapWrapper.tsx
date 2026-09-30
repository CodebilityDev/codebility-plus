"use client";

import dynamic from "next/dynamic";

const AnimatedRoadmapSvg = dynamic(() => import("@/components/auth/onboarding/AnimatedRoadmapSvg"), {
  ssr: false,
  loading: () => <div className="relative h-full w-full" />,
});

export default function AnimatedRoadmapWrapper({ className = "", ...rest }) {
  return (
    <div
      id="roadmap-svg-wrapper"
      className={`relative h-full w-full ${className}`}
      {...rest}
    >
      <AnimatedRoadmapSvg />
    </div>
  );
}
