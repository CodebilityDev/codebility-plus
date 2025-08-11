import { useState, useEffect } from "react";
import AnimatedRoadmapSvg from "./AnimatedRoadmapSvg";

export default function AnimatedRoadmapWrapper() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setReady(true), 0); // ensure next tick
  }, []);

  return (
    <div id="roadmap-svg-wrapper" data-ready={ready}>
      {ready ? <AnimatedRoadmapSvg /> : null}
    </div>
  );
}
