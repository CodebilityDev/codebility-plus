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
          "relative flex w-[270px] shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0a0a] p-3",
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
        <div className="flex min-w-0 flex-col gap-1 pr-4">
          <p className="truncate text-sm font-semibold leading-5 text-[#f4f4f4]">
            {name}
          </p>
          <p className="truncate text-xs leading-[18px] text-white/50">
            {role}
          </p>
          {skills && skills.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill) => (
                <TechTag
                  key={skill}
                  className="h-5 px-1.5 text-[10px] leading-4"
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
            className="absolute right-3 top-3 h-3.5 w-3.5 text-[#02ffe2]"
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[380px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]",
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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#121214] via-[#1d1238] to-[#0b2c33]">
            <span className="text-6xl font-semibold text-white/80">
              {initials}
            </span>
          </div>
        )}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent"
        />
        {badge ? <div className="absolute left-4 top-4">{badge}</div> : null}
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-3">
          <p className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
            {name}
          </p>
          <p className="text-sm text-white/50">{role}</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-between px-4 py-3">
        {profileHref ? (
          <TextLink asChild>
            <Link href={profileHref}>
              View profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </TextLink>
        ) : (
          <span className="inline-flex items-center gap-2 text-[15px] leading-5 text-[#c084fc]">
            View profile
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
        <div className="flex items-center gap-3 text-white/50">
          {linkedinHref ? (
            <Link
              href={linkedinHref}
              aria-label={`${name} on LinkedIn`}
              className="rounded-full transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          ) : (
            <Linkedin aria-hidden className="h-4 w-4" />
          )}
          {websiteHref ? (
            <Link
              href={websiteHref}
              aria-label={`${name} website`}
              className="rounded-full transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <Globe className="h-4 w-4" />
            </Link>
          ) : (
            <Globe aria-hidden className="h-4 w-4" />
          )}
        </div>
      </div>
    </div>
  );
}

export { ProfileCard };
