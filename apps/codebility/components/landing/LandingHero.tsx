import { BadgeCheck, Rocket, Star } from "lucide-react";
import { Suspense } from "react";

import { cn } from "@codevs/ui";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { HeroSearch } from "@/components/landing/HeroSearch";
import { HeroSearchShell } from "@/components/landing/HeroSearchShell";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { LandingDeveloperContent } from "@/components/landing/LandingDeveloperContent";
import { LandingSearchCardsSkeleton } from "@/components/landing/LandingSearchCardsSkeleton";
import { LandingSearchTransition } from "@/components/landing/LandingSearchTransition";
import { heroStats } from "@/constants/landing/landing-content";
import type {
  HeroCodev,
  LandingSearchParams,
} from "@/types/landing/hero-codevs";

const statIcons = [Rocket, Star, BadgeCheck];

const gradientText = "cb-accent-text";

interface LandingHeroProps {
  codevs: HeroCodev[];
  searchParams: LandingSearchParams;
}

function LandingHero({ codevs, searchParams }: LandingHeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-[var(--cb-space-64)] pt-[var(--cb-space-80)] sm:pt-[var(--cb-space-96)] lg:pb-[var(--cb-space-80)] lg:pt-[var(--cb-space-96)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-7rem] h-[50rem] w-[84rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_32%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_20%,transparent)_40%,color-mix(in_srgb,var(--cb-primary)_8%,transparent)_60%,color-mix(in_srgb,var(--cb-primary)_3%,transparent)_75%,transparent_90%)]" />
      </div>

      <LandingContainer className="relative flex flex-col items-center">
        <Eyebrow variant="outline">HIRE SKILLED FILIPINO DEVELOPERS</Eyebrow>

        <h1 className="mt-[var(--cb-space-28)] text-center text-[44px] font-semibold leading-[1.08] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[58px] sm:leading-[1.05] lg:text-[80px] lg:leading-[1.02]">
          Connecting you to the
          <span className={cn("mx-auto block w-fit", gradientText)}>
            right talent
          </span>
        </h1>

        <p className="mx-auto mt-[var(--cb-space-16)] max-w-[620px] text-center text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg sm:leading-7">
          Vetted engineers, designers and strategists who join your roadmap in
          days, not months. From MVP to full product teams.
        </p>

        <LandingSearchTransition>
          <div className="mt-[var(--cb-space-32)] w-full">
            <Suspense fallback={<HeroSearchShell />}>
              <HeroSearch />
            </Suspense>
          </div>

          <ul className="mt-[var(--cb-space-40)] flex w-full flex-col items-center gap-[var(--cb-space-16)] sm:flex-row sm:justify-center sm:gap-[var(--cb-space-40)] lg:mt-[var(--cb-space-48)] lg:gap-[var(--cb-space-64)]">
            {heroStats.map((stat, index) => {
              const Icon = statIcons[index] ?? Rocket;

              return (
                <li
                  key={stat.label}
                  className="flex items-center gap-[var(--cb-space-12)]"
                >
                  <span
                    aria-hidden
                    className="flex h-[var(--cb-size-32)] w-[var(--cb-size-32)] shrink-0 items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)]"
                  >
                    <Icon className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] text-[color:var(--cb-text-secondary)]" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-base font-semibold leading-6 text-[color:var(--cb-text)]">
                      {stat.value}
                      {stat.lead ? ` ${stat.lead}` : null}
                    </span>
                    <span className="text-sm leading-5 text-[color:var(--cb-text-muted)]">
                      {stat.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-[var(--cb-space-56)] w-full">
            <Suspense fallback={<LandingSearchCardsSkeleton />}>
              <LandingDeveloperContent
                codevs={codevs}
                searchParams={searchParams}
              />
            </Suspense>
          </div>
        </LandingSearchTransition>
      </LandingContainer>
    </section>
  );
}

export { LandingHero };
