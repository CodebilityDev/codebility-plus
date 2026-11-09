import { ClientLogo } from "@/components/global/design-system/ClientLogo";
import { LogoCell } from "@/components/global/design-system/LogoCell";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { partners } from "@/constants/landing/landing-content";

function LandingPartners() {
  return (
    <section className="border-t border-[color:var(--cb-border)] pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[105px] lg:pt-[112px]">
      <LandingContainer>
        <SectionHeader
          eyebrowVariant="outline"
          align="center"
          eyebrow="OUR PARTNERS"
          title="You're in great company"
          description="Teams across industries trust Codebility to design, build and ship."
        />

        <div className="mt-[var(--cb-space-48)] grid grid-cols-2 gap-px border border-[color:var(--cb-border)] bg-[color:var(--cb-border)] md:grid-cols-3 xl:grid-cols-6">
          {partners.map((partner) => (
            <LogoCell
              key={partner.name}
              variant={partner.accent ? "accent" : "default"}
              className="w-full"
            >
              <ClientLogo
                name={partner.name}
                className="grayscale brightness-150 opacity-80 transition-[filter,opacity] duration-300 ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 motion-reduce:transition-none"
              />
            </LogoCell>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

export { LandingPartners };
