import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { CodevsCommunityList } from "@/components/landing/codevs/CodevsCommunityList";
import type { CommunityData } from "@/types/landing/codevs/community";

function CodevsCommunity({ members, total }: CommunityData) {
  return (
    <section
      id="people"
      className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-[112px]"
    >
      <LandingContainer className="flex flex-col gap-[var(--cb-space-40)]">
        <SectionHeader
          align="center"
          eyebrowVariant="outline"
          eyebrow="THE COMMUNITY"
          eyebrowClassName="tracking-[0.24em]"
          title={
            <span className="bg-gradient-to-r from-[var(--cb-p100)] via-[var(--cb-p200)] to-[var(--cb-cyan-light)] bg-clip-text text-transparent">
              Meet the people you&apos;ll build with
            </span>
          }
          description="CoDevs who started where you are and now ship real products."
          className="[&_p]:max-w-[64ch]"
        />

        <CodevsCommunityList members={members} total={total} />
      </LandingContainer>
    </section>
  );
}

export { CodevsCommunity };
