import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  LayoutGrid,
  Users,
} from "lucide-react";

import { Button } from "@/components/global/design-system/Button";
import { LandingContainer } from "@/components/global/layout/LandingContainer";

const popularPages = [
  {
    title: "Services",
    description: "What we build and our recent projects.",
    href: "/services",
    icon: LayoutGrid,
  },
  {
    title: "CoDevs",
    description: "Browse our developers and mentors.",
    href: "/codevs",
    icon: Users,
  },
  {
    title: "Careers",
    description: "Open roles at Codebility and partners.",
    href: "/careers",
    icon: BriefcaseBusiness,
  },
  {
    title: "Book a Call",
    description: "Talk to us about your project.",
    href: "/bookacall",
    icon: CalendarDays,
  },
];

export function NotFoundContent() {
  return (
    <section className="relative overflow-hidden border-b border-[color:var(--cb-border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(ellipse_58%_90%_at_50%_0%,color-mix(in_srgb,var(--cb-primary)_34%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_12%,transparent)_42%,transparent_74%)]"
      />

      <LandingContainer className="relative pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[140px] lg:pt-[120px]">
        <div className="mx-auto flex max-w-[1040px] flex-col items-center text-center">
          <p className="select-none bg-gradient-to-r from-[#ff8bd8] via-[#f472b6] to-[#b794f6] bg-clip-text text-[clamp(7rem,18vw,12.5rem)] font-bold leading-[0.78] tracking-[-0.07em] text-transparent">
            404
          </p>
          <h1 className="mt-[var(--cb-space-24)] text-[36px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[46px]">
            Page not found
          </h1>
          <p className="mt-[var(--cb-space-16)] max-w-[560px] text-base leading-7 text-[color:var(--cb-text-muted)]">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
            Check the address, or pick up from one of these.
          </p>
          <div className="mt-[var(--cb-space-32)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
            <Button asChild>
              <Link href="/">
                Back to home
                <ArrowRight
                  aria-hidden
                  className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-[var(--cb-space-64)] max-w-[1040px]">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--cb-text-muted)]">
            Popular pages
          </p>
          <div className="mt-[var(--cb-space-20)] grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 lg:grid-cols-4">
            {popularPages.map((page) => {
              const Icon = page.icon;

              return (
                <Link
                  key={page.title}
                  href={page.href}
                  className="group flex min-h-[166px] flex-col rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-20)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--cb-primary)_6%,var(--cb-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-[var(--cb-size-40)] w-[var(--cb-size-40)] items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:color-mix(in_srgb,var(--cb-primary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_14%,transparent)] text-[color:var(--cb-p300)]">
                      <Icon
                        aria-hidden
                        className="h-[var(--cb-size-18)] w-[var(--cb-size-18)]"
                      />
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="mt-[var(--cb-space-4)] h-[var(--cb-size-18)] w-[var(--cb-size-18)] text-[color:var(--cb-text-muted)] transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <h2 className="mt-[var(--cb-space-16)] text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
                    {page.title}
                  </h2>
                  <p className="mt-[var(--cb-space-4)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                    {page.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
