"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import ExpectSectionWrapper from "./ExpectSectionWrapper";
import HouseRulesSectionWrapper from "./HouseRulesSectionWrapper";
import OnboardingClientWrapper from "./OnboardingClientWrapper";
import OnboardingStepper from "./OnboardingStepper";
import PartnersSectionWrapper from "./PartnersSectionWrapper";
import RoadMapWrapper from "./RoadMapSectionWrapper";
import SoftwareSectionWrapper from "./SoftwareSectionWrapper";
import TeamSectionWrapper from "./TeamSectionWrapper";
import WellcomeSectionWrapper from "./WellcomeSectionWrapper";
import { Button } from "@codevs/ui/button";

export default function OnboardingPage() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle mobile signup button click
  const handleSignupClick = () => {
    router.push('/auth/sign-up');
  };
  
  return (
    <main className="relative min-h-screen">
      {/* Vertical stepper navigation (desktop only) */}
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

      {/* ✅ NEW: Mobile-only persistent signup button (lines 48-67) */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <Button
          onClick={handleSignupClick}
          className="
            group
            relative
            overflow-hidden
            rounded-full
            bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600
            px-6 py-3
            font-semibold text-white
            shadow-2xl shadow-blue-500/30
            transition-all duration-300
            hover:scale-105 hover:shadow-blue-500/50
            active:scale-95
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          "
          aria-label="Go to signup page"
        >
          {/* Animated gradient background on hover */}
          <span className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Button text */}
          <span className="relative z-10 flex items-center gap-2">
            Signup Now!
          </span>
        </Button>
      </div>
    </main>
  );
}