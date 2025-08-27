// app/auth/onboarding/HouseRulesSectionWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const HouseRulesSection = dynamic(
  () => import("./_components/HouseRules/HouseRulesSection"),
  { ssr: false }
);

export default function HouseRulesSectionWrapper() {
  return <HouseRulesSection />;
}
