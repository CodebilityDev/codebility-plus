import { Quote } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/global/design-system/Button";
import { QuoteCard } from "@/components/global/design-system/QuoteCard";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";

const storyMetrics = [
  { value: "120+", label: "Projects shipped" },
  { value: "12", label: "Partner companies" },
  { value: "4.9", label: "Average rating" },
];

export function LandingStories() {
  return (
    <section id="stories" className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-32">
      <LandingContainer className="grid gap-[var(--cb-space-48)] lg:grid-cols-2 lg:items-center lg:gap-[var(--cb-space-64)]">
        <div className="flex flex-col gap-[var(--cb-space-24)]">
          <SectionHeader
            eyebrowVariant="outline"
            eyebrow="CLIENT STORIES"
            title="Trusted by clients"
            accent="around the globe"
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
                <p className="text-xs leading-4 text-[color:var(--cb-text-muted)]">{metric.label}</p>
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

        <div className="relative w-full">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[40px] bg-[color:color-mix(in_srgb,var(--cb-primary)_25%,transparent)] blur-3xl"
          />
          <QuoteCard
            className="relative"
            avatarGradient="cyan"
            quote="Codebility gave us a dedicated team within a week. We shipped our MVP on schedule and kept the same developers for the next release."
            name="Client Name"
            role="Founder, Partner Company"
            initials="CN"
            rating={5}
            page={2}
            pageCount={3}
          />
          <Quote
            aria-hidden
            className="pointer-events-none absolute right-6 top-6 h-[var(--cb-size-40)] w-[var(--cb-size-40)] text-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)]"
          />
        </div>
      </LandingContainer>
    </section>
  );
}