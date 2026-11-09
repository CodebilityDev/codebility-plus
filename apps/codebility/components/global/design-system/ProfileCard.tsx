import { ArrowRight, BadgeCheck, Globe, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";
import { TechTag } from "@/components/global/design-system/TechTag";
import { TextLink } from "@/components/global/design-system/TextLink";

export type ProfileCardVariant = "compact" | "tall";

export interface ProfileCardProps {
  name: string;
  role: string;
  initials: string;
  imageSrc?: string;
  imageAlt?: string;
  skills?: string[];
  verified?: boolean;
  badge?: ReactNode;
  profileHref?: string;
  linkedinHref?: string;
  websiteHref?: string;
  variant?: ProfileCardVariant;
  className?: string;
}

function ProfileCard({
  name,
  role,
  initials,
  imageSrc,
  imageAlt,
  skills,
  verified = false,
  badge,
  profileHref,
  linkedinHref,
  websiteHref,
  variant = "tall",
  className,
}: ProfileCardProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "relative flex w-[270px] shrink-0 items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-12)]",
          className,
        )}
      >
        <Avatar
          initials={initials}
          src={imageSrc}
          alt={imageAlt ?? name}
          size={40}
          gradient="teal"
        />
        <div className="flex min-w-0 flex-col gap-[var(--cb-space-4)] pr-[var(--cb-space-16)]">
          <p className="truncate text-sm font-semibold leading-5 text-[color:var(--cb-text)]">
            {name}
          </p>
          <p className="truncate text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
            {role}
          </p>
          {skills && skills.length > 0 ? (
            <div className="flex flex-wrap gap-[var(--cb-space-4)]">
              {skills.slice(0, 3).map((skill) => (
                <TechTag
                  key={skill}
                  className="h-[var(--cb-size-20)] px-[var(--cb-space-6)] text-[10px] leading-4"
                >
                  {skill}
                </TechTag>
              ))}
            </div>
          ) : null}
        </div>
        {verified ? (
          <BadgeCheck
            aria-label="Verified"
            className="absolute right-4 top-4 h-[var(--cb-size-14)] w-[var(--cb-size-14)] text-[color:var(--cb-text-muted)]"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[380px] w-full flex-col overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]",
        className,
      )}
    >
      <div className="relative h-[300px] w-full overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? name}
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--cb-surface-2)] via-[color:color-mix(in_srgb,var(--cb-brand-end)_20%,transparent)] to-[color:color-mix(in_srgb,var(--cb-brand-start)_20%,transparent)]">
            <span className="text-6xl font-semibold text-[color:var(--cb-text-secondary)]">
              {initials}
            </span>
          </div>
        )}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[var(--cb-bg)] via-transparent to-transparent"
        />
        {badge ? <div className="absolute left-4 top-4">{badge}</div> : null}
        <div className="absolute inset-x-4 bottom-4 rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:color-mix(in_srgb,var(--cb-surface)_90%,transparent)] p-[var(--cb-space-12)]">
          <p className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
            {name}
          </p>
          <p className="text-sm text-[color:var(--cb-text-muted)]">{role}</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between px-[var(--cb-space-16)] py-[var(--cb-space-12)]">
        {profileHref ? (
          <TextLink asChild>
            <Link href={profileHref}>
              View profile
              <ArrowRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          </TextLink>
        ) : (
          <span className="inline-flex items-center gap-[var(--cb-space-8)] text-[15px] leading-5 text-[color:var(--cb-p400)]">
            View profile
            <ArrowRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
          </span>
        )}
        <div className="flex items-center gap-[var(--cb-space-12)] text-[color:var(--cb-text-muted)]">
          {linkedinHref ? (
            <Link
              href={linkedinHref}
              aria-label={`${name} on LinkedIn`}
              className="rounded-[var(--cb-radius-full)] transition-colors hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)]"
            >
              <Linkedin className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          ) : (
            <Linkedin aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
          )}
          {websiteHref ? (
            <Link
              href={websiteHref}
              aria-label={`${name} website`}
              className="rounded-[var(--cb-radius-full)] transition-colors hover:text-[color:var(--cb-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)]"
            >
              <Globe className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          ) : (
            <Globe aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
          )}
        </div>
      </div>
    </div>
  );
}

export { ProfileCard };
