import { BadgeCheck, Rocket, Star } from "lucide-react";

import { cn } from "@codevs/ui";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { ProfileCard } from "@/components/global/design-system/ProfileCard";
import { HeroSearch } from "@/components/landing/HeroSearch";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { heroPeople, heroStats } from "@/constants/landing/landing-content";

const statIcons = [Rocket, Star, BadgeCheck];

const gradientText =
  "bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent";

function LandingHero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-20 sm:pt-24 lg:pb-24 lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-22rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[#9747ff]/25 blur-[140px]" />
        <div className="absolute left-[-12%] top-[12rem] h-[26rem] w-[26rem] rounded-full bg-[#9747ff]/15 blur-[130px]" />
        <div className="absolute right-[-10%] top-[6rem] h-[30rem] w-[30rem] rounded-full bg-[#02ffe2]/10 blur-[150px]" />
        <div className="absolute left-1/2 top-[18rem] h-[24rem] w-[42rem] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[150px]" />
      </div>

      <LandingContainer className="relative flex flex-col items-center">
        <Eyebrow variant="outline">HIRE SKILLED FILIPINO DEVELOPERS</Eyebrow>

        <h1 className="mt-7 text-center text-[44px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#f4f4f4] sm:text-[58px] sm:leading-[1.05] lg:text-[84px] lg:leading-[1.02] xl:text-[96px]">
          Connecting you to the
          <span className={cn("block", gradientText)}>right talent</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[620px] text-center text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
          Vetted engineers, designers and strategists who join your roadmap in
          days, not months. From MVP to full product teams.
        </p>

        <HeroSearch />

        <ul className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10 lg:mt-12 lg:gap-16">
          {heroStats.map((stat, index) => {
            const Icon = statIcons[index] ?? Rocket;

            return (
              <li key={stat.label} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
                >
                  <Icon className="h-[18px] w-[18px] text-white/70" />
                </span>
                <span className="flex flex-col">
                  <span className="text-lg font-semibold leading-6 text-[#f4f4f4]">
                    {stat.value}
                    {stat.lead ? ` ${stat.lead}` : null}
                  </span>
                  <span className="text-sm leading-5 text-white/50">
                    {stat.label}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <div
          role="region"
          aria-label="Featured CoDevs"
          tabIndex={0}
          className="scrollbar-hide mt-12 flex w-full gap-3 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]"
        >
          {heroPeople.map((person) => (
            <ProfileCard
              key={person.name}
              variant="compact"
              name={person.name}
              role={person.role}
              initials={person.initials}
              skills={person.skills}
              verified={person.verified}
            />
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

export { LandingHero };
