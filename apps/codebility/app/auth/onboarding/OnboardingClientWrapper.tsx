// /app/auth/onboarding/OnboardingClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// Only use dynamic here, inside a client component!
const HeroWithAboutEffect = dynamic(() => import("./_components/HeroWithAboutEffect/index"), {
  ssr: false,
});

export default function OnboardingClientWrapper() {
  return <HeroWithAboutEffect />;
}
