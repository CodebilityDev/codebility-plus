"use client";

import { forwardRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { WellcomeSectionWrapperProps } from "@/types/auth/onboarding/onboarding";


const WellcomeSection = dynamic(
  () => import("@/components/auth/onboarding/WelcomeSection"),
  {
    ssr: false,
  },
);

const WellcomeSectionWrapper = forwardRef<HTMLDivElement, WellcomeSectionWrapperProps>(
  function WellcomeSectionWrapper({ className = "", ...rest }, ref) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
      const t = setTimeout(() => setReady(true), 0);
      return () => clearTimeout(t);
    }, []);

    return (
      <div
        ref={ref}
        data-welcome-ready={ready ? "true" : "false"}
        className={`relative w-full ${className}`}
        {...rest}
      >
        {ready ? <WellcomeSection /> : null}
      </div>
    );
  },
);

export default WellcomeSectionWrapper;
