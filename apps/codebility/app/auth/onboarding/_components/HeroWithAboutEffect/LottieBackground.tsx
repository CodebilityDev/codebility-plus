"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import animationData from "@/public/assets/images/onboarding/animation/developer-01-whoooa.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LottieBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

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
          opacity: 0.45,
        }}
      />
    </div>
  );
}
