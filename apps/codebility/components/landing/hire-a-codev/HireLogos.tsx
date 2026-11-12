import { ClientLogo } from "@/components/global/design-system/ClientLogo";
import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { trustedPartners } from "@/constants/landing/hire-a-codev/content";

export function HireLogos() {
  return (
    <section
      aria-label="Companies that hire with Codebility"
      className="py-[var(--cb-space-32)]"
    >
      <HireContainer>
        <div className="grid grid-cols-2 items-center justify-items-center gap-x-[var(--cb-space-24)] gap-y-[var(--cb-space-24)] border-t border-[color:var(--cb-border)] pt-[var(--cb-space-32)] sm:grid-cols-3 lg:grid-cols-6">
          {trustedPartners.map((partner) => (
            <ClientLogo
              key={partner.name}
              name={partner.name}
              className="h-[var(--cb-size-40)] w-[140px] opacity-55 grayscale brightness-150 sm:w-[150px]"
            />
          ))}
        </div>
      </HireContainer>
    </section>
  );
}
