import Link from "next/link";

import { Button } from "@/components/global/design-system/Button";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { LandingStoryDeck } from "@/components/landing/LandingStoryDeck";

const storyMetrics = [
  { value: "120+", label: "Projects shipped" },
  { value: "12", label: "Partner companies" },
  { value: "4.9", label: "Average rating" },
];

export function LandingStories() {
  return (
    <section
      id="stories"
      className="relative overflow-hidden border-t border-[color:var(--cb-border)] pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[103px] lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 top-[18%] h-[520px] w-[760px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_20%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_8%,transparent)_48%,transparent_72%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[280px] w-[620px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-pink)_10%,transparent)_0%,transparent_72%)] blur-3xl" />
      </div>

      <LandingContainer className="relative grid gap-[var(--cb-space-48)] lg:grid-cols-2 lg:items-start lg:gap-[72px]">
        <div className="flex flex-col gap-[var(--cb-space-24)]">
          <SectionHeader
            eyebrowVariant="outline"
            eyebrow="CLIENT STORIES"
            eyebrowClassName="px-[var(--cb-space-28)] tracking-[0.12em]"
            title="Trusted by clients"
            accent="around the globe"
            accentClassName="w-fit"
            description="Startups and agencies rely on Codebility to extend their teams and ship faster."
          />

          <div className="grid grid-cols-3 divide-x divide-[color:var(--cb-border)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] py-[var(--cb-space-20)]">
            {storyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex min-w-0 flex-col gap-[var(--cb-space-4)] px-[var(--cb-space-16)] sm:px-[var(--cb-space-24)]"
              >
                <p className="text-xl font-semibold leading-7 text-[color:var(--cb-text)] sm:text-2xl sm:leading-8">
                  {metric.value}
                </p>
                <p className="text-xs leading-4 text-[color:var(--cb-text-muted)]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-[var(--cb-space-12)]">
            <Button asChild variant="outline">
              <Link href="/#contact">Let&apos;s talk</Link>
            </Button>
            <Button asChild>
              <Link href="/hire-a-codev">Hire CoDevs</Link>
            </Button>
          </div>
        </div>

        <LandingStoryDeck />
      </LandingContainer>
    </section>
  );
}
