"use client";

import { forwardRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WellcomeSection = dynamic(
  () => import("./_components/Wellcome/WellcomeSection"),
  {
    ssr: false,
  },
);

type Props = React.HTMLAttributes<HTMLDivElement>;

const WellcomeSectionWrapper = forwardRef<HTMLDivElement, Props>(
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
