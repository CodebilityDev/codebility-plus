// /app/auth/onboarding/page.tsx
import IsRoadMap from "./_components/RoadMap/IsRoadMap";
import ExpectFromUsWrapper from "./ExpectFromUsWrapper";
import ExpectSectionWrapper from "./ExpectSectionWrapper";
import IsAndIsntSectionWrapper from "./IsAndIsntSectionWrapper";
import IsNotSectionWrapper from "./IsNotSectionWrapper";
import MindsetSectionWrapper from "./MindsetSectionWrapper";
import OnboardingClientWrapper from "./OnboardingClientWrapper";
import SoftwareSectionWrapper from "./SoftwareSectionWrapper";

export default function OnboardingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ExpectFromUsWrapper />
      <IsRoadMap />
      <div className="min-h-[200vh]"></div>
    </main>
  );
}
