import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";
import type { AvatarGradient } from "@/components/global/design-system/Avatar";
import { StatusBadge } from "@/components/global/design-system/StatusBadge";
import { TechTag } from "@/components/global/design-system/TechTag";
import { TextLink } from "@/components/global/design-system/TextLink";

export interface DeveloperCardProps {
  initials: string;
  name: string;
  role: string;
  skills: string[];
  availability?: "available" | "busy";
  profileHref?: string;
  profileLabel?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  gradient?: AvatarGradient;
  className?: string;
}

const profileClasses =
  "ml-auto inline-flex items-center gap-[var(--cb-space-8)] text-[15px] leading-5 text-[color:var(--cb-p400)]";

function DeveloperCard({
  initials,
  name,
  role,
  skills,
  availability = "available",
  profileHref,
  profileLabel = "View profile",
  avatarSrc,
  avatarAlt,
  gradient,
  className,
}: DeveloperCardProps) {
  return (
    <div
      className={cn(
        "flex h-[300px] flex-col gap-[var(--cb-space-16)] rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-24)]",
        className,
      )}
    >
      <div className="flex items-center gap-[var(--cb-space-12)]">
        <Avatar
          initials={initials}
          src={avatarSrc}
          alt={avatarAlt}
          size={56}
          gradient={gradient}
        />
        <div className="flex min-w-0 flex-col gap-[var(--cb-space-2)]">
          <p className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
            {name}
          </p>
          <p className="text-sm text-[color:var(--cb-text-muted)]">{role}</p>
        </div>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-[var(--cb-space-6)]">
          {skills.map((skill) => (
            <TechTag key={skill}>{skill}</TechTag>
          ))}
        </div>
      ) : null}
      <div className="flex-1" />
      <div className="flex items-center gap-[var(--cb-space-8)]">
        <StatusBadge status={availability} />
        {profileHref ? (
          <TextLink asChild className="ml-auto">
            <Link href={profileHref}>
              {profileLabel}
              <ArrowRight aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          </TextLink>
        ) : (
          <span className={profileClasses}>
            {profileLabel}
            <ArrowRight aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
          </span>
        )}
      </div>
    </div>
  );
}

export { DeveloperCard };
