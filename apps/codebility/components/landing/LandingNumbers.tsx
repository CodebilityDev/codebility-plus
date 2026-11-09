import { MetricCard } from "@/components/global/design-system/MetricCard";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { metrics } from "@/constants/landing/landing-content";

function LandingNumbers() {
  return (
    <section
      id="numbers"
      className="border-t border-[color:var(--cb-border)] pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[114px] lg:pt-[112px]"
    >
      <LandingContainer>
        <SectionHeader
          eyebrowVariant="outline"
          align="center"
          eyebrow="BY THE NUMBERS"
          title="Proven results"
          description="Numbers from years of building products with clients around the world."
          className="gap-[var(--cb-space-20)]"
        />

        <div className="mt-[30px] grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[var(--cb-space-24)]">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <MetricCard
                key={metric.label}
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
