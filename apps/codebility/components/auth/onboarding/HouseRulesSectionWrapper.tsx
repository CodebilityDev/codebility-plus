"use client";

import dynamic from "next/dynamic";

const HouseRulesSection = dynamic(
  () => import("@/components/auth/onboarding/HouseRulesSection"),
  { ssr: false }
);

export default function HouseRulesSectionWrapper() {
  return <HouseRulesSection />;
}
