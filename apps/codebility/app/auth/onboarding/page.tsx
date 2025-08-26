// app/auth/onboarding/page.tsx (patched)

"use client";

import { useRef } from "react";

import IsRoadMap from "./_components/RoadMap/IsRoadMap";
import ExpectFromUsWrapper from "./ExpectFromUsWrapper";
import ExpectSectionWrapper from "./ExpectSectionWrapper";
import HouseRulesSectionWrapper from "./HouseRulesSectionWrapper";
import IsAndIsntSectionWrapper from "./IsAndIsntSectionWrapper";
import IsNotSectionWrapper from "./IsNotSectionWrapper";
import MindsetSectionWrapper from "./MindsetSectionWrapper";
import OnboardingClientWrapper from "./OnboardingClientWrapper";
import PartnersSectionWrapper from "./PartnersSectionWrapper";
import RoadMapWrapper from "./RoadMapSectionWrapper";
import SoftwareSectionWrapper from "./SoftwareSectionWrapper";
import TeamSectionWrapper from "./TeamSectionWrapper";
import WellcomeSectionWrapper from "./WellcomeSectionWrapper";

export default function OnboardingPage() {
  const roadmapRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative min-h-screen">
      <OnboardingClientWrapper />
      <SoftwareSectionWrapper />
      <MindsetSectionWrapper />
      <ExpectSectionWrapper />
      <IsAndIsntSectionWrapper />
      <IsNotSectionWrapper />
      <ExpectFromUsWrapper />
      <RoadMapWrapper roadmapRef={roadmapRef} />
      <HouseRulesSectionWrapper />
      <TeamSectionWrapper />
      <PartnersSectionWrapper />
      <WellcomeSectionWrapper />
    </main>
  );
}
