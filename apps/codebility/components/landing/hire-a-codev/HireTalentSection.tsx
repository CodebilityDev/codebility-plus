import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { HireSectionHeading } from "@/components/landing/hire-a-codev/HireSectionHeading";
import { HireTalentBrowser } from "@/components/landing/hire-a-codev/HireTalentBrowser";

interface HireTalentSectionProps {
  searchParams: Promise<{
    filter?: string | string[];
    tech?: string | string[];
  }>;
}

export function HireTalentSection({ searchParams }: HireTalentSectionProps) {
  return (
    <section id="talent" className="relative overflow-hidden py-[var(--cb-space-96)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_10%,transparent)_0%,transparent_70%)] blur-3xl"
      />
      <HireContainer className="relative">
        <HireSectionHeading
          eyebrow="AVAILABLE TALENT"
          title="See who you could"
          accent="hire"
          description="Every CoDev is interviewed, skill-tested and backed by a mentor."
        />
        <HireTalentBrowser searchParams={searchParams} />
      </HireContainer>
    </section>
  );
}
