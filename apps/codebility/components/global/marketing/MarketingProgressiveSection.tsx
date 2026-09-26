

import MarketingMotionReadyMarker from "@/components/global/marketing/MarketingMotionReadyMarker";
import type { MarketingProgressiveSectionProps } from "@/types/global/marketing";


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
