import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/global/design-system/Button";
import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { HireSectionHeading } from "@/components/landing/hire-a-codev/HireSectionHeading";
import { hireModels } from "@/constants/landing/hire-a-codev/content";

export function HireModels() {
  return (
    <section className="relative border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)]">
      <HireContainer>
        <HireSectionHeading
          eyebrow="WAYS TO WORK WITH US"
          title="Pick the model that"
          accent="fits your team"
          description="Every engagement is scoped to your needs. Tell us what you're building and we'll send a quote."
        />

        <div className="mt-[var(--cb-space-56)] flex flex-col gap-[var(--cb-space-12)]">
          {hireModels.map((model) => {
            const Icon = model.icon;

            return (
              <div
                key={model.title}
                className={
                  "relative overflow-hidden rounded-[var(--cb-radius-16)] border " +
                  (model.featured
                    ? "border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--cb-primary)_17%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_7%,transparent)_48%,color-mix(in_srgb,var(--cb-surface)_82%,transparent)_100%)]"
                    : "border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]")
                }
              >
                <div className="grid gap-[var(--cb-space-24)] p-[var(--cb-space-24)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.7fr)_auto] lg:items-center lg:gap-[var(--cb-space-32)]">
                  <div className="flex items-start gap-[var(--cb-space-16)]">
                    <span className="flex h-[var(--cb-size-48)] w-[var(--cb-size-48)] shrink-0 items-center justify-center rounded-[var(--cb-radius-12)] border border-[color:color-mix(in_srgb,var(--cb-primary)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_10%,transparent)] text-[color:var(--cb-p300)]">
                      <Icon
                        aria-hidden
                        className="h-[var(--cb-size-20)] w-[var(--cb-size-20)]"
                      />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-[var(--cb-space-8)]">
                        <h3 className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
                          {model.title}
                        </h3>
                        {model.badge ? (
                          <span className="inline-flex h-[var(--cb-size-20)] items-center rounded-[var(--cb-radius-full)] bg-[color:var(--cb-primary)] px-[var(--cb-space-8)] text-[9px] font-semibold uppercase leading-3 tracking-[0.08em] text-[color:var(--cb-text)]">
                            {model.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-[var(--cb-space-4)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                        {model.description}
                      </p>
                    </div>
                  </div>

                  <ul className="grid gap-x-[var(--cb-space-24)] gap-y-[var(--cb-space-8)] sm:grid-cols-2">
                    {model.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-secondary)]"
                      >
                        <Check
                          aria-hidden
                          className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0 text-[color:var(--cb-success)]"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant={model.featured ? "primary" : "outline"}
                    className="w-full lg:w-[148px]"
                  >
                    <Link href="/contact">Get a quote</Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-[var(--cb-space-24)] text-center text-sm leading-5 text-[color:var(--cb-text-muted)]">
          Not sure which fits?{" "}
          <Link
            href="/bookacall"
            className="font-medium text-[color:var(--cb-p300)] underline-offset-4 hover:underline"
          >
            Book a free 30-minute call
            <ArrowRight
              aria-hidden
              className="ml-1 inline h-[var(--cb-size-14)] w-[var(--cb-size-14)]"
            />
          </Link>
        </p>
      </HireContainer>
    </section>
  );
}
