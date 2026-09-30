"use client";

import { forwardRef } from "react";
import dynamic from "next/dynamic";
import type { WellcomeSectionWrapperProps } from "@/types/auth/onboarding/onboarding";

const WellcomeSection = dynamic(
  () => import("@/components/auth/onboarding/WelcomeSection"),
  {
    ssr: false,
    loading: () => <div className="relative w-full" />,
  },
);

const WellcomeSectionWrapper = forwardRef<HTMLDivElement, WellcomeSectionWrapperProps>(
  function WellcomeSectionWrapper({ className = "", ...rest }, ref) {
    return (
      <div ref={ref} className={`relative w-full ${className}`} {...rest}>
        <WellcomeSection />
      </div>
    );
  },
);

export default WellcomeSectionWrapper;
