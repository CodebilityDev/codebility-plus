// /app/auth/onboarding/SoftwareSectionWrapper.tsx
"use client";

import { useEffect } from "react";

import SoftwareDevelopmentSection from "./_components/SoftwareDevelopment/SoftwareDevelopmentSection";

export default function SoftwareSectionWrapper() {
  useEffect(() => {
    // Make sure browser scrolls to top on load
    window.scrollTo(0, 0);
  }, []);

  return <SoftwareDevelopmentSection />;
}
