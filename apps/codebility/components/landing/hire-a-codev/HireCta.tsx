import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { hireCtaFeatures } from "@/constants/landing/hire-a-codev/content";

export function HireCta() {
  return (
    <section className="relative border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)]">
      <HireContainer>
        <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:color-mix(in_srgb,var(--cb-primary)_32%,transparent)] bg-[color:var(--cb-surface)] p-[var(--cb-space-32)] sm:p-[var(--cb-space-40)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_srgb,var(--cb-primary)_26%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_8%,transparent)_40%,transparent_68%)]"
          />
          <div className="relative grid gap-[var(--cb-space-32)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-[var(--cb-space-56)]">
            <div>
              <Eyebrow
                variant="outline"
                className="px-[var(--cb-space-16)] tracking-[0.12em]"
              >
                START HIRING
              </Eyebrow>
              <h2 className="mt-[var(--cb-space-16)] text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[44px]">
                Build your{" "}
                <span className="cb-community-text">dream team</span>
              </h2>
              <p className="mt-[var(--cb-space-12)] max-w-[500px] text-base leading-7 text-[color:var(--cb-text-muted)]">
                Tell us what you need in a free 30-minute call. We&apos;ll come
                back with a shortlist.
              </p>
              <div className="mt-[var(--cb-space-24)] flex flex-wrap items-center gap-[var(--cb-space-12)]">
                <Button asChild>
                  <Link href="/bookacall">
                    Book a Call
                    <ArrowRight
                      aria-hidden
                      className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                    />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/services">See our work</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-[var(--cb-space-8)]">
              {hireCtaFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(151,71,255,0.04))] px-[var(--cb-space-16)] py-[var(--cb-space-12)] shadow-[0_8px_24px_rgba(0,0,0,0.14)] backdrop-blur-2xl"
                  >
                    <span className="flex h-[var(--cb-size-36)] w-[var(--cb-size-36)] shrink-0 items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:color-mix(in_srgb,var(--cb-primary)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-white)_5%,transparent)] text-[color:var(--cb-p300)]">
                      <Icon
                        aria-hidden
                        className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                      />
                    </span>
                    <span className="text-sm leading-5 text-[color:var(--cb-text-secondary)]">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </HireContainer>
    </section>
  );
}
