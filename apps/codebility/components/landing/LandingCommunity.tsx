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
    <section id="community" className="py-16 lg:py-24">
      <LandingContainer>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] px-6 py-16 sm:px-10 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_90%_at_0%_0%,rgba(151,71,255,0.45),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_10%,rgba(151,71,255,0.3),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(151,71,255,0.18)_0%,transparent_45%,rgba(151,71,255,0.22)_100%)]"
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

          <div className="relative flex flex-col items-center gap-5 text-center">
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

            <h2 className="text-balance text-[32px] font-bold leading-9 tracking-tight text-[#f4f4f4] md:text-[44px] md:leading-[48px]">
              Join a community of{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                100+ developers
              </span>
            </h2>

            <p className="max-w-[54ch] text-base leading-6 text-white/60 sm:text-lg sm:leading-7">
              Sharpen your craft on real client projects, learn from mentors and
              unlock opportunities around the world.
            </p>

            <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
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
