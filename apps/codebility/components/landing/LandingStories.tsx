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
    <section id="stories" className="border-t border-white/10 py-24 lg:py-32">
      <LandingContainer className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <SectionHeader
            eyebrowVariant="outline"
            eyebrow="CLIENT STORIES"
            title="Trusted by clients"
            accent="around the globe"
            description="Startups and agencies rely on Codebility to extend their teams and ship faster."
          />

          <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-[#0a0a0a] py-5">
            {storyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex min-w-0 flex-col gap-1 px-4 sm:px-6"
              >
                <p className="text-xl font-semibold leading-7 text-[#f4f4f4] sm:text-2xl sm:leading-8">
                  {metric.value}
                </p>
                <p className="text-xs leading-4 text-white/50">{metric.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
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
            className="pointer-events-none absolute inset-0 rounded-[40px] bg-[#9747ff]/25 blur-3xl"
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
            className="pointer-events-none absolute right-6 top-6 h-10 w-10 text-white/20"
          />
        </div>
      </LandingContainer>
    </section>
  );
}