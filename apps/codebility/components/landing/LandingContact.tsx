import { Clock, Mail, Sparkles } from "lucide-react";

import { Avatar } from "@/components/global/design-system/Avatar";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { IconTile } from "@/components/global/design-system/IconTile";
import { Rating } from "@/components/global/design-system/Rating";
import { ContactForm } from "@/components/landing/ContactForm";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { StrategyCallCard } from "@/components/landing/StrategyCallCard";

const benefits = [
  { icon: Clock, label: "Free 30-minute consultation" },
  { icon: Sparkles, label: "Tailored solutions for your business" },
  { icon: Mail, label: "Reply within one business day" },
];

export function LandingContact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        <div className="h-[720px] w-[1120px] shrink-0 rounded-[var(--cb-radius-full)] bg-[radial-gradient(closest-side,var(--cb-focus-glow),transparent)] blur-2xl" />
      </div>

      <LandingContainer className="relative">
        <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
          <Eyebrow variant="outline">{"LET'S CONNECT"}</Eyebrow>
          <h2
            id="contact-heading"
            className="mt-[var(--cb-space-24)] text-3xl font-bold leading-tight tracking-tight text-[color:var(--cb-text)] sm:text-4xl lg:text-[44px]"
          >
            Let&apos;s build something together
          </h2>
          <p className="mt-[var(--cb-space-16)] max-w-[560px] text-sm leading-6 text-[color:var(--cb-text-muted)]">
            Tell us about your project. Then pick a time for a free 30-minute
            strategy call.
          </p>
        </div>

        <div className="mt-[var(--cb-space-40)] grid gap-[var(--cb-space-16)] lg:mt-[var(--cb-space-48)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[var(--cb-space-24)]">
          <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] bg-[linear-gradient(135deg,var(--cb-brand-start)_0%,var(--cb-brand-mid)_30%,var(--cb-brand-end)_62%,var(--cb-primary)_100%)] p-[var(--cb-space-24)] text-[color:var(--cb-text)] sm:p-[var(--cb-space-32)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-[var(--cb-radius-full)] bg-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] blur-3xl"
            />

            <div className="relative flex h-full flex-col">
              <ul className="flex flex-col gap-[var(--cb-space-16)]">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <li key={benefit.label} className="flex items-center gap-[var(--cb-space-12)]">
                      <IconTile
                        variant="glass"
                        className="h-[var(--cb-size-36)] w-[var(--cb-size-36)] rounded-[var(--cb-radius-8)] border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] bg-[color:var(--cb-surface-hover)] text-[color:var(--cb-text)]"
                      >
                        <Icon aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
                      </IconTile>
                      <span className="text-sm font-medium leading-5 text-[color:var(--cb-text)]">
                        {benefit.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <StrategyCallCard className="mt-[var(--cb-space-28)]" />

              <figure className="mt-[var(--cb-space-24)]">
                <Rating value={5} />
                <blockquote className="mt-[var(--cb-space-12)] text-sm leading-6 text-[color:var(--cb-text)]">
                  &ldquo;Clear communication, weekly demos and a team that
                  genuinely cares about the product.&rdquo;
                </blockquote>
                <figcaption className="mt-[var(--cb-space-16)] flex items-center gap-[var(--cb-space-12)]">
                  <Avatar
                    initials="CN"
                    alt="Client Name"
                    gradient="violet"
                    size={40}
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium leading-5 text-[color:var(--cb-text)]">
                      Client Name
                    </span>
                    <span className="text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
                      Founder, Partner Company
                    </span>
                  </span>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)]">
            <ContactForm />
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
