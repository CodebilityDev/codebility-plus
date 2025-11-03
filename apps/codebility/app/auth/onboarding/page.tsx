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
import OnboardingStepper from "./OnboardingStepper";
import PartnersSectionWrapper from "./PartnersSectionWrapper";
import RoadMapWrapper from "./RoadMapSectionWrapper";
import SoftwareSectionWrapper from "./SoftwareSectionWrapper";
import TeamSectionWrapper from "./TeamSectionWrapper";
import WellcomeSectionWrapper from "./WellcomeSectionWrapper";

export default function OnboardingPage() {
  const roadmapRef = useRef<HTMLDivElement>(null);

  return (
    <main className="relative min-h-screen">
      {/* Vertical stepper navigation */}
      <OnboardingStepper />

      <OnboardingClientWrapper />

      {/* Each section wrapped with ID for stepper tracking */}
      <section id="software">
        <SoftwareSectionWrapper />
      </section>

      <section id="expect">
        <ExpectSectionWrapper />
      </section>

      <section id="roadmap">
        <RoadMapWrapper roadmapRef={roadmapRef} />
      </section>

      <section id="house-rules">
        <HouseRulesSectionWrapper />
      </section>

      <section id="team">
        <TeamSectionWrapper />
      </section>

      <section id="partners">
        <PartnersSectionWrapper />
      </section>

      <section id="welcome">
        <WellcomeSectionWrapper />
      </section>
    </main>
  );
}