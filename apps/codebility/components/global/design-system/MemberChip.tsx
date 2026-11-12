import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";

export interface MemberChipProps {
  name: string;
  role: string;
  initials: string;
  href: string;
  avatarSrc?: string;
  badge?: ReactNode;
  highlighted?: boolean;
  className?: string;
}

function MemberChip({
  name,
  role,
  initials,
  href,
  avatarSrc,
  badge,
  highlighted = false,
  className,
}: MemberChipProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-[58px] max-w-full items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-full)] border px-2.5 py-[var(--cb-space-8)] pr-[var(--cb-space-20)] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]",
        highlighted
          ? "border-[color:color-mix(in_srgb,var(--cb-primary)_60%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_18%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--cb-primary)_26%,transparent)]"
          : "border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] hover:bg-[color:var(--cb-glass)]",
        className,
      )}
    >
      <span aria-hidden>
        <Avatar initials={initials} src={avatarSrc} alt={name} size={40} />
      </span>
      <span className="flex min-w-0 flex-col gap-[var(--cb-space-2)]">
        <span className="flex items-center gap-[var(--cb-space-8)]">
          <span className="truncate text-sm font-semibold leading-5 text-[color:var(--cb-text)]">
            {name}
          </span>
          {badge}
        </span>
        <span className="truncate text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
          {role}
        </span>
      </span>
    </Link>
  );
}

export { MemberChip };
