import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";
import type { AvatarGradient } from "@/components/global/design-system/Avatar";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import type { CommunityMember } from "@/types/global/landing-people";

const avatarGradients: AvatarGradient[] = ["violet", "teal", "cyan"];

const floatingPositions = [
  "left-[9%] top-[18%] opacity-90",
  "right-[8%] top-[23%] opacity-40",
  "left-[14%] top-[80%] opacity-70",
  "right-[14%] top-[76%] opacity-55",
];

interface CommunityAction {
  label: string;
  href: string;
}

interface LandingCommunityProps {
  codevs: CommunityMember[];
  total?: number;
  eyebrow?: string;
  description?: string;
  secondaryAction?: CommunityAction;
  floating?: boolean;
  primaryArrow?: boolean;
  className?: string;
}

export function LandingCommunity({
  codevs,
  total = 96,
  eyebrow = "BE A CODEV",
  description = "Sharpen your craft on real client projects, learn from mentors and unlock opportunities around the world.",
  secondaryAction = { label: "How it works", href: "#process" },
  floating = true,
  primaryArrow = false,
  className,
}: LandingCommunityProps) {
  const topCodevs = codevs.slice(0, 6);
  const floatingCodevs = floating
    ? [codevs[6], codevs[7], codevs[0], codevs[1]].filter(
        (codev): codev is CommunityMember => Boolean(codev),
      )
    : [];
  const remaining = Math.max(0, total - topCodevs.length);

  return (
    <section
      id="community"
      className={cn(
        "py-[var(--cb-space-64)] lg:pb-[112px] lg:pt-[113px]",
        className,
      )}
    >
      <LandingContainer>
        <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[#0D0A10] px-[var(--cb-space-24)] py-[var(--cb-space-48)] sm:px-[var(--cb-space-40)] lg:h-[427px] lg:px-0 lg:py-0">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_100%_at_50%_0%,#3A205A_0%,#2C1946_45%,#120D18_80%,#0D0A10_100%)]"
          />

          {floatingCodevs.map((codev, index) => (
            <span
              key={`${codev.id}-float`}
              aria-hidden
              className={cn(
                "pointer-events-none absolute hidden h-10 w-10 overflow-hidden rounded-[var(--cb-radius-full)] lg:block",
                floatingPositions[index],
              )}
            >
              <Avatar
                initials={codev.initials}
                src={codev.imageSrc}
                alt={codev.name}
                gradient={avatarGradients[index % avatarGradients.length]}
                size={40}
              />
            </span>
          ))}

          <div className="relative flex flex-col items-center text-center lg:pt-[53px]">
            <div
              role="group"
              aria-label={`${total} CoDevs`}
              className="flex items-center"
            >
              {topCodevs.map((codev, index) => (
                <span
                  key={codev.id}
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--cb-radius-full)] border-2 border-[color:color-mix(in_srgb,var(--cb-white)_80%,transparent)] bg-[color:var(--cb-surface)]",
                    index >= 4 && "hidden sm:inline-flex",
                  )}
                >
                  <Avatar
                    initials={codev.initials}
                    src={codev.imageSrc}
                    alt={codev.name}
                    gradient={avatarGradients[index % avatarGradients.length]}
                    size={40}
                  />
                </span>
              ))}
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-white)_10%,transparent)] bg-[#17111E] text-xs text-[color:var(--cb-p200)]">
                +{remaining}
              </span>
            </div>

            <Eyebrow
              variant="outline"
              className="mt-[var(--cb-space-24)] px-[var(--cb-space-24)] tracking-[0.08em] lg:mt-[33px]"
            >
              {eyebrow}
            </Eyebrow>

            <h2 className="mt-[var(--cb-space-20)] text-balance text-[32px] font-bold leading-9 tracking-tight text-[color:var(--cb-text)] md:text-[44px] md:leading-[48px] lg:mt-[31px]">
              Join a community of{" "}
              <span className="cb-community-text">100+ developers</span>
            </h2>

            <p className="mt-[var(--cb-space-16)] max-w-[600px] text-base leading-6 text-[color:var(--cb-text-muted)] sm:text-lg sm:leading-7">
              {description}
            </p>

            <div className="mt-[var(--cb-space-16)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)] lg:mt-[13px]">
              <Button
                asChild
                className="shadow-[0_0_36px_color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
              >
                <Link href="/auth/sign-up">
                  Join the Program
                  {primaryArrow ? (
                    <ArrowRight
                      aria-hidden
                      className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                    />
                  ) : null}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
