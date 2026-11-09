import * as React from "react";

import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";

export interface MemberChipProps {
  name: string;
  role: string;
  initials: string;
  avatarSrc?: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}

const MemberChip = React.forwardRef<HTMLButtonElement, MemberChipProps>(
  (
    { name, role, initials, avatarSrc, selected = false, onClick, className },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex h-[58px] items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-full)] border px-2.5 py-[var(--cb-space-8)] pr-[var(--cb-space-20)] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]",
        selected
          ? "border-[color:color-mix(in_srgb,var(--cb-primary)_60%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_18%,transparent)]"
          : "border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] hover:bg-[color:var(--cb-glass)]",
        className,
      )}
    >
      <span aria-hidden>
        <Avatar initials={initials} src={avatarSrc} alt={name} size={40} />
      </span>
      <span className="flex min-w-0 flex-col gap-[var(--cb-space-2)]">
        <span className="text-sm font-semibold leading-5 text-[color:var(--cb-text)]">
          {name}
        </span>
        <span className="text-xs leading-[18px] text-[color:var(--cb-text-muted)]">{role}</span>
      </span>
    </button>
  ),
);

MemberChip.displayName = "MemberChip";

export { MemberChip };
