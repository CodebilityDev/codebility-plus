// /app/auth/onboarding/OnboardingClientWrapper.tsx
"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

// Only use dynamic here, inside a client component!
const HeroWithAboutEffect = dynamic(
  () => import("./_components/HeroWithAboutEffect/index"),
);

export default function OnboardingClientWrapper() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <HeroWithAboutEffect />;
}
