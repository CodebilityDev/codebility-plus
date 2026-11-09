import { BadgeCheck } from "lucide-react";
import Link from "next/link";

import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";
import { TechTag } from "@/components/global/design-system/TechTag";
import type { TechTagTone } from "@/components/global/design-system/TechTag";
import type { HeroCodev } from "@/types/landing/hero-codevs";

function toneForSkill(skill: string): TechTagTone {
  const value = skill.toLowerCase();

  if (value.includes("back")) return "teal";
  if (
    value.includes("front") ||
    value.includes("qa") ||
    value.includes("quality") ||
    value.includes("test") ||
    value.includes("ui") ||
    value.includes("ux") ||
    value.includes("design")
  ) {
    return "purple";
  }
  if (
    value.includes("mobile") ||
    value.includes("android") ||
    value.includes("ios")
  ) {
    return "blue";
  }

  return "blue";
}

export interface HeroDeveloperCardProps {
  codev: HeroCodev;
  className?: string;
}

function HeroDeveloperCard({ codev, className }: HeroDeveloperCardProps) {
  return (
    <Link
      href={`/profiles/${codev.id}`}
      className={cn(
        "group relative flex h-[148px] w-full items-start gap-[var(--cb-space-12)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border-solid)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-primary)_50%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]",
        className,
      )}
    >
      <Avatar
        initials={codev.initials}
        src={codev.imageSrc}
        alt={codev.name}
        size={48}
        gradient="teal"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--cb-space-4)] pr-[var(--cb-space-16)]">
        <p className="truncate text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
          {codev.name}
        </p>
        <p className="truncate text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
          {codev.role}
        </p>
        {codev.skills.length > 0 ? (
          <div className="mt-[var(--cb-space-8)] flex flex-wrap gap-[var(--cb-space-4)]">
            {codev.skills.slice(0, 3).map((skill) => (
              <TechTag
                key={skill}
                tone={toneForSkill(skill)}
                className="h-[var(--cb-size-20)] px-[var(--cb-space-6)] text-[10px]"
              >
                {skill}
              </TechTag>
            ))}
          </div>
        ) : null}
      </div>
      {codev.verified ? (
        <BadgeCheck
          aria-label="Verified"
          className="absolute right-[var(--cb-space-16)] top-[var(--cb-space-16)] h-[var(--cb-size-14)] w-[var(--cb-size-14)] text-[color:var(--cb-text-muted)]"
        />
      ) : null}
    </Link>
  );
}

export { HeroDeveloperCard };
