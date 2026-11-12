import { Quote } from "lucide-react";

import { Avatar } from "@/components/global/design-system/Avatar";
import { ClientLogo } from "@/components/global/design-system/ClientLogo";
import { Rating } from "@/components/global/design-system/Rating";
import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { HireSectionHeading } from "@/components/landing/hire-a-codev/HireSectionHeading";
import {
  hireProofLogos,
  hireProofStats,
  hireTestimonial,
} from "@/constants/landing/hire-a-codev/content";

export function HireStories() {
  return (
    <section className="relative overflow-hidden border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-56 top-[15%] h-[520px] w-[820px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_22%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_6%,transparent)_48%,transparent_75%)] blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[360px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-pink)_8%,transparent)_0%,transparent_70%)] blur-3xl" />
      </div>

      <HireContainer className="relative grid gap-[var(--cb-space-40)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-[var(--cb-space-56)]">
        <div>
          <HireSectionHeading
            align="left"
            eyebrow="CLIENT PROOF"
            title="Trusted by teams"
            accent="around the globe"
            description="Startups and agencies in Australia, Singapore and beyond extend their teams with CoDevs."
            className="max-w-[440px]"
          />

          <div className="mt-[var(--cb-space-32)] grid grid-cols-3 divide-x divide-[color:var(--cb-border)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] py-[var(--cb-space-20)]">
            {hireProofStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-[var(--cb-space-4)] px-[var(--cb-space-16)] sm:px-[var(--cb-space-24)]"
              >
                <p className="cb-metric-text text-xl font-semibold leading-7 sm:text-2xl sm:leading-8">
                  {stat.value}
                </p>
                <p className="text-xs leading-4 text-[color:var(--cb-text-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-[var(--cb-space-16)] grid grid-cols-2 overflow-hidden rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] sm:grid-cols-4">
            {hireProofLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex h-[var(--cb-size-64)] items-center justify-center border-b border-r border-[color:var(--cb-border)] last:border-b-0 sm:border-b-0 sm:last:border-r-0"
              >
                <ClientLogo
                  name={logo.name}
                  className={
                    "h-[22px] w-[88px] sm:h-[22px] sm:w-[88px] " +
                    logo.className
                  }
                  imageClassName="scale-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -bottom-16 top-10 rounded-[48px] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_32%,transparent)_0%,color-mix(in_srgb,var(--cb-pink)_10%,transparent)_45%,transparent_72%)] blur-3xl"
          />
          <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:color-mix(in_srgb,var(--cb-primary)_32%,transparent)] bg-[linear-gradient(145deg,#120B1C_0%,#0A0A0A_72%)] p-[var(--cb-space-32)] shadow-[0_0_80px_color-mix(in_srgb,var(--cb-primary)_18%,transparent)]">
            <Quote
              aria-hidden
              className="absolute right-[var(--cb-space-32)] top-[var(--cb-space-32)] h-[var(--cb-size-40)] w-[var(--cb-size-40)] text-[color:color-mix(in_srgb,var(--cb-white)_16%,transparent)]"
            />
            <Rating value={5} size="md" />
            <blockquote className="mt-[var(--cb-space-24)] max-w-[560px] text-lg leading-7 text-[color:var(--cb-text-secondary)]">
              &ldquo;{hireTestimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-[var(--cb-space-32)] flex items-center gap-[var(--cb-space-12)]">
              <Avatar
                initials={hireTestimonial.initials}
                alt={hireTestimonial.name}
                size={48}
                gradient="violet"
              />
              <div>
                <p className="text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
                  {hireTestimonial.name}
                </p>
                <p className="mt-[var(--cb-space-2)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                  {hireTestimonial.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </HireContainer>
    </section>
  );
}
