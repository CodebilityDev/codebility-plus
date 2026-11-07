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
  "ml-auto inline-flex items-center gap-2 text-[15px] leading-5 text-[#c084fc]";

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
        "flex h-[300px] flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar
          initials={initials}
          src={avatarSrc}
          alt={avatarAlt}
          size={56}
          gradient={gradient}
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
            {name}
          </p>
          <p className="text-sm text-white/50">{role}</p>
        </div>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <TechTag key={skill}>{skill}</TechTag>
          ))}
        </div>
      ) : null}
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <StatusBadge status={availability} />
        {profileHref ? (
          <TextLink asChild className="ml-auto">
            <Link href={profileHref}>
              {profileLabel}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </TextLink>
        ) : (
          <span className={profileClasses}>
            {profileLabel}
            <ArrowRight aria-hidden className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}

export { DeveloperCard };
