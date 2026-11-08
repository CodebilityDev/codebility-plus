import { cn } from "@codevs/ui";

import { MetricCard } from "@/components/global/design-system/MetricCard";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { metrics } from "@/constants/landing/landing-content";

function LandingNumbers() {
  return (
    <section id="numbers" className="border-t border-white/10 py-24 lg:py-32">
      <LandingContainer>
        <SectionHeader
          eyebrowVariant="outline"
          align="center"
          eyebrow="BY THE NUMBERS"
          title="Proven results"
          description="Numbers from years of building products with clients around the world."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <MetricCard
                key={metric.label}
                className={cn("h-full")}
                icon={<Icon />}
                value={metric.value}
                label={metric.label}
                description={metric.description}
              />
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}

export { LandingNumbers };