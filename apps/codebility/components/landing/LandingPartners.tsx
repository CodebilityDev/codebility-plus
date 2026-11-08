import { ClientLogo } from "@/components/global/design-system/ClientLogo";
import { LogoCell } from "@/components/global/design-system/LogoCell";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { partners } from "@/constants/landing/landing-content";

function LandingPartners() {
  return (
    <section className="border-t border-white/10 py-24 lg:py-32">
      <LandingContainer>
        <SectionHeader
          eyebrowVariant="outline"
          align="center"
          eyebrow="OUR PARTNERS"
          title="You're in great company"
          description="Teams across industries trust Codebility to design, build and ship."
        />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {partners.map((partner) => (
            <LogoCell
              key={partner.name}
              variant={partner.accent ? "accent" : "default"}
              className="w-full"
            >
              <ClientLogo name={partner.name} />
            </LogoCell>
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

export { LandingPartners };