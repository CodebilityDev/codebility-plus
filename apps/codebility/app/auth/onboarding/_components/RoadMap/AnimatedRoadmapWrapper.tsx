"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AnimatedRoadmapSvg = dynamic(() => import("./AnimatedRoadmapSvg"), {
  ssr: false,
});

export default function AnimatedRoadmapWrapper({ className = "", ...rest }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      id="roadmap-svg-wrapper"
      data-roadmap-ready={ready ? "true" : "false"}
      className={`relative h-full w-full ${className}`}
      {...rest}
    >
      {ready ? <AnimatedRoadmapSvg /> : null}
    </div>
  );
}
