// app/auth/onboarding/TeamSectionWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const TeamSection = dynamic(() => import("./_components/Team/TeamSection"), {
  ssr: false,
});

export default function TeamSectionWrapper() {
  return <TeamSection />;
}
