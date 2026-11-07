import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type MemberCardGradient = "teal" | "violet" | "cyan";

const gradientClasses: Record<MemberCardGradient, string> = {
  teal: "from-[#00738b] to-[#0a3b9d]",
  violet: "from-[#9747ff] to-[#c108fe]",
  cyan: "from-[#0c3fdb] to-[#02ffe2]",
};

export interface MemberCardProps {
  initials: string;
  name: string;
  role: string;
  badge?: ReactNode;
  gradient?: MemberCardGradient;
  footer?: ReactNode;
  className?: string;
}

function MemberCard({
  initials,
  name,
  role,
  badge,
  gradient = "teal",
  footer,
  className,
}: MemberCardProps) {
  return (
    <div
      className={cn(
        "flex h-[300px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center gap-4 bg-gradient-to-b",
          gradientClasses[gradient],
        )}
      >
        {badge ? <div className="absolute left-4 top-4">{badge}</div> : null}
        <span className="text-5xl font-bold leading-[48px] text-white">
          {initials}
        </span>
        <div className="w-[calc(100%_-_48px)] rounded-xl border border-white/10 bg-[#0a0a0a]/90 p-3">
          <p className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
            {name}
          </p>
          <p className="text-sm text-white/60">{role}</p>
        </div>
      </div>
      {footer ? (
        <div className="flex h-16 items-center gap-2 p-3 text-sm text-white/60">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export { MemberCard };
