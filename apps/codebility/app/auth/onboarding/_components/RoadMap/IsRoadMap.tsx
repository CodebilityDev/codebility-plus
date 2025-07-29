"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Dynamically load the SVG after hydration
const AnimatedRoadmapSvg = dynamic(() => import("./AnimatedRoadmapSvg"), {
  ssr: false,
});

export default function IsRoadMap() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const phases = [
    {
      title: "Phase 1: Code Explorer",
      steps: ["Learn The Basics", "Hands-On Practice", "Version Control"],
    },
    {
      title: "Phase 2: Artisan",
      steps: [
        "Deepen Language Proficiency",
        "Explore Frameworks & Libraries",
        "Work On Projects",
        "Development Practices",
      ],
    },
    {
      title: "Phase 3: Specialization",
      steps: ["Specialize", "Advanced Concepts", "Collaborate"],
    },
    {
      title: "Phase 4: Code Maestro",
      steps: [
        "Leadership",
        "Innovate",
        "Contribute To The Community",
        "Continues Learning",
      ],
    },
  ];

  return (
    <div
      id="isroadmap-trigger"
      className="relative h-[200vh] w-full snap-start bg-white px-4 py-10"
    >
      {isDesktop ? (
        <div id="roadmap-svg-wrapper" className="relative w-full">
          <AnimatedRoadmapSvg />
        </div>
      ) : (
        <div className="mx-auto max-w-xl space-y-8">
          {phases.map((phase, i) => (
            <div
              key={`mobile-${i}`}
              className="rounded-lg bg-white p-6 shadow-md transition duration-300"
            >
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                {phase.title}
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {phase.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
