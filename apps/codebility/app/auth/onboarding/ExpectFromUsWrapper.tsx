// /app/auth/onboarding/_components/ExpectFromUsWrapper.tsx
"use client";

import dynamic from "next/dynamic";

// ✅ Lazy-load the section
const ExpectFromUs = dynamic(
  () => import("./_components/ExpectFromUs/ExpectFromUsSection"),
  { ssr: false },
);

export default function ExpectFromUsWrapper() {
  return <ExpectFromUs />;
}
