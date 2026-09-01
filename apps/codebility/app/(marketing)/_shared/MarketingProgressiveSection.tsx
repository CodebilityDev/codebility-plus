import type { ReactNode } from "react";

type MarketingProgressiveSectionProps = {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
};

/**
 * SSR-friendly section shell: shows static skeleton until motion JS is ready,
 * then reveals animated content without hiding parts already in the viewport.
 */
export default function MarketingProgressiveSection({
  children,
  skeleton,
  className,
}: MarketingProgressiveSectionProps) {
  return (
    <div data-landing-section className={className}>
      <div data-landing-skeleton aria-hidden="true">
        {skeleton}
      </div>
      <div data-landing-content>{children}</div>
    </div>
  );
}
