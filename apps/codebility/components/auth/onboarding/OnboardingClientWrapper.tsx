"use client";

import dynamic from "next/dynamic";

const HeroWithAboutEffect = dynamic(
  () => import("@/components/auth/onboarding/OnboardingHero"),
);

export default function OnboardingClientWrapper() {
  return <HeroWithAboutEffect />;
}
