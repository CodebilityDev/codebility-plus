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
        "inline-flex h-[58px] items-center gap-3 rounded-full border px-2.5 py-2 pr-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]",
        selected
          ? "border-[#9747ff]/60 bg-[#9747ff]/[0.18]"
          : "border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-white/[0.04]",
        className,
      )}
    >
      <span aria-hidden>
        <Avatar initials={initials} src={avatarSrc} alt={name} size={40} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-semibold leading-5 text-[#f4f4f4]">
          {name}
        </span>
        <span className="text-xs leading-[18px] text-white/50">{role}</span>
      </span>
    </button>
  ),
);

MemberChip.displayName = "MemberChip";

export { MemberChip };
