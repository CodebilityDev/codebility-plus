import Link from "next/link";

import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";
import type { AvatarGradient } from "@/components/global/design-system/Avatar";
import { AvatarStack } from "@/components/global/design-system/AvatarStack";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { heroPeople, people } from "@/constants/landing/landing-content";

const avatarGradients: AvatarGradient[] = ["violet", "teal", "cyan"];

const stackPeople = [
  ...people,
  ...heroPeople.filter(
    (hero) => !people.some((person) => person.name === hero.name),
  ),
];

const floatingAvatars: {
  initials: string;
  src?: string;
  gradient: AvatarGradient;
  className: string;
}[] = [
  {
    initials: "HC",
    src: "/assets/images/landing/hallen-corpuz.png",
    gradient: "violet",
    className: "left-[7%] top-[13%] lg:block",
  },
  {
    initials: "AJ",
    gradient: "teal",
    className: "right-[7%] top-[16%] lg:block",
  },
  {
    initials: "JD",
    src: "/assets/images/landing/jan-phillip-dacallos.png",
    gradient: "cyan",
    className: "left-[15%] top-[52%] xl:block",
  },
  {
    initials: "WS",
    gradient: "violet",
    className: "right-[17%] top-[55%] xl:block",
  },
];

export function LandingCommunity() {
  return (
    <section id="community" className="py-[var(--cb-space-64)] lg:py-[var(--cb-space-96)]">
      <LandingContainer>
        <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] px-[var(--cb-space-24)] py-[var(--cb-space-64)] sm:px-[var(--cb-space-40)] lg:py-[var(--cb-space-80)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_90%_at_0%_0%,var(--cb-selected-border),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_10%,var(--cb-role-mentor-bg),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,var(--cb-primary-subtle)_0%,transparent_45%,var(--cb-role-mentor-bg)_100%)]"
          />

          {floatingAvatars.map((avatar) => (
            <span
              key={avatar.initials}
              aria-hidden
              className={cn(
                "pointer-events-none absolute hidden",
                avatar.className,
              )}
            >
              <Avatar
                initials={avatar.initials}
                src={avatar.src}
                alt={avatar.initials}
                gradient={avatar.gradient}
                size={40}
              />
            </span>
          ))}

          <div className="relative flex flex-col items-center gap-[var(--cb-space-20)] text-center">
            <AvatarStack
              items={stackPeople.map((person, index) => ({
                initials: person.initials,
                alt: person.name,
                src: person.imageSrc,
                gradient: avatarGradients[index % avatarGradients.length],
              }))}
              max={6}
              total={96}
              size={40}
            />

            <Eyebrow variant="outline">BE A CODEV</Eyebrow>

            <h2 className="text-balance text-[32px] font-bold leading-9 tracking-tight text-[color:var(--cb-text)] md:text-[44px] md:leading-[48px]">
              Join a community of{" "}
              <span className="cb-accent-text">
                100+ developers
              </span>
            </h2>

            <p className="max-w-[54ch] text-base leading-6 text-[color:var(--cb-text-muted)] sm:text-lg sm:leading-7">
              Sharpen your craft on real client projects, learn from mentors and
              unlock opportunities around the world.
            </p>

            <div className="mt-[var(--cb-space-4)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
              <Button asChild>
                <Link href="/auth/sign-up">Join the Program</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#process">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
