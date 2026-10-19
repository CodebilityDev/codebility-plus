"use client";

import dynamic from "next/dynamic";

const ExpectSection = dynamic(
  () => import("@/components/auth/onboarding/ExpectSection"),
  {
    ssr: false,
  },
);

export default function ExpectSectionWrapper() {
  return <ExpectSection />;
}
