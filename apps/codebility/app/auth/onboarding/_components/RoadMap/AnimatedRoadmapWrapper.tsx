"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AnimatedRoadmapSvg = dynamic(() => import("./AnimatedRoadmapSvg"), {
  ssr: false,
});

export default function AnimatedRoadmapWrapper() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Ensure client DOM is ready before rendering SVG
    setReady(true);
  }, []);

  return ready ? <AnimatedRoadmapSvg /> : null;
}
