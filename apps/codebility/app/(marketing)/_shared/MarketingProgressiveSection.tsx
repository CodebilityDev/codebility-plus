import type { ReactNode } from "react";

import MarketingMotionReadyMarker from "./MarketingMotionReadyMarker";

type MarketingProgressiveSectionProps = {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
};

export default function MarketingProgressiveSection({
  children,
  skeleton,
  className,
}: MarketingProgressiveSectionProps) {
  return (
    <div data-landing-section className={className}>
      <MarketingMotionReadyMarker />
      <div data-landing-skeleton aria-hidden="true">
        {skeleton}
      </div>
      <div data-landing-content>{children}</div>
    </div>
  );
}
