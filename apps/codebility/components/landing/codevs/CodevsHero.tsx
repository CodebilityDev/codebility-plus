import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@codevs/ui";

import { AvatarStack } from "@/components/global/design-system/AvatarStack";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { IconTile } from "@/components/global/design-system/IconTile";
import { TechTag } from "@/components/global/design-system/TechTag";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import {
  heroStackTags,
  heroStats,
} from "@/constants/landing/codevs/codevs-content";
import type { CommunityCodev } from "@/types/landing/codevs/community";

const cardClasses =
  "flex min-h-[190px] flex-col rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-24)]";

interface CodevsHeroProps {
  members: CommunityCodev[];
  total: number;
}

function CodevsHero({ members, total }: CodevsHeroProps) {
  const avatars = members.slice(0, 5).map((member) => ({
    initials: member.initials,
    src: member.imageSrc,
    alt: member.name,
  }));

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-[var(--cb-space-64)] pt-[var(--cb-space-80)] lg:pb-[var(--cb-space-80)] lg:pt-[var(--cb-space-96)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,color-mix(in_srgb,var(--cb-primary)_34%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_12%,transparent)_45%,transparent_80%)]" />
        <div className="absolute inset-x-0 top-0 h-[44rem] bg-[linear-gradient(color-mix(in_srgb,var(--cb-white)_4%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--cb-white)_4%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <LandingContainer className="relative flex flex-col items-center">
        <Eyebrow
          variant="outline"
          className="px-[var(--cb-space-16)] tracking-[0.24em]"
        >
          BE A CODEV
        </Eyebrow>

        <h1 className="mt-[var(--cb-space-28)] text-center text-[44px] font-bold leading-[1.08] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[56px] sm:leading-[1.05] lg:text-[68px] lg:leading-[1.08]">
          Build your skills on
          <span className="cb-accent-text mx-auto block w-fit">
            real projects
          </span>
        </h1>

        <p className="mt-[var(--cb-space-20)] max-w-[680px] text-center text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg sm:leading-[30px]">
          Not a bootcamp. A community where developers, UI/UX designers and QA
          grow together, build their portfolio and launch international careers.
        </p>

        <div className="mt-[var(--cb-space-32)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
          <Button
            asChild
            className="shadow-[0_0_36px_color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
          >
            <Link href="/auth/sign-up">
              Join the Program
              <ArrowRight
                aria-hidden
                className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
              />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#roadmap">See the roadmap</Link>
          </Button>
        </div>

        <ul className="mt-[var(--cb-space-64)] grid w-full grid-cols-1 gap-[var(--cb-space-20)] sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <li className={cardClasses}>
            <AvatarStack items={avatars} max={5} total={total} size={40} />
            <p className="cb-metric-text mt-auto pt-[var(--cb-space-20)] text-[44px] font-bold leading-[48px] tracking-[-0.03em]">
              100+
            </p>
            <p className="mt-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
              CoDevs building together
            </p>
          </li>

          {heroStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <li key={stat.label} className={cardClasses}>
                <IconTile
                  variant={stat.tint ? "tint" : "glass"}
                  className="[&>svg]:h-[var(--cb-size-18)] [&>svg]:w-[var(--cb-size-18)]"
                >
                  <Icon aria-hidden />
                </IconTile>
                <p className="cb-metric-text mt-auto pt-[var(--cb-space-20)] text-[44px] font-bold leading-[48px] tracking-[-0.03em]">
                  {stat.value}
                </p>
                <p className="mt-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                  {stat.label}
                </p>
              </li>
            );
          })}

          <li className={cn(cardClasses, "gap-[var(--cb-space-6)]")}>
            <div className="flex flex-wrap gap-[var(--cb-space-6)]">
              {heroStackTags.map((tag) => (
                <TechTag key={tag} tone="neutral">
                  {tag}
                </TechTag>
              ))}
            </div>
            <p className="mt-auto pt-[var(--cb-space-12)] text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
              The stack you&apos;ll use
            </p>
            <p className="text-sm leading-5 text-[color:var(--cb-text-muted)]">
              Same tools as real client work
            </p>
          </li>
        </ul>
      </LandingContainer>
    </section>
  );
}

export { CodevsHero };
