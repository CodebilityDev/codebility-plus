// app/auth/onboarding/page.tsx (patched)

"use client";

import { useRef } from "react";

import IsRoadMap from "./_components/RoadMap/IsRoadMap";
import ExpectFromUsWrapper from "./ExpectFromUsWrapper";
import ExpectSectionWrapper from "./ExpectSectionWrapper";
import IsAndIsntSectionWrapper from "./IsAndIsntSectionWrapper";
import IsNotSectionWrapper from "./IsNotSectionWrapper";
import MindsetSectionWrapper from "./MindsetSectionWrapper";
import OnboardingClientWrapper from "./OnboardingClientWrapper";
import RoadMapWrapper from "./RoadMapSectionWrapper";
import SoftwareSectionWrapper from "./SoftwareSectionWrapper";

export default function OnboardingPage() {
  const roadmapRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <OnboardingClientWrapper />
      <SoftwareSectionWrapper />
      <MindsetSectionWrapper />
      <ExpectSectionWrapper />
      <IsAndIsntSectionWrapper />
      <IsNotSectionWrapper />
      <ExpectFromUsWrapper />
      <RoadMapWrapper roadmapRef={roadmapRef} />
      <div className="min-h-[200vh]"></div>
    </main>
  );
}
