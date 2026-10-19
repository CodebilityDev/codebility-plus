"use client";

import dynamic from "next/dynamic";
import animationData from "@/public/assets/images/onboarding/animation/developer-01-whoooa.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" />,
});

export default function LottieBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
          transform: "translate(-30%, 11%)",
          opacity: 0.1,
        }}
      />
    </div>
  );
}
