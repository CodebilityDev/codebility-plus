import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type MemberCardGradient = "teal" | "violet" | "cyan";

const gradientClasses: Record<MemberCardGradient, string> = {
  teal: "from-[var(--cb-brand-start)] to-[var(--cb-brand-mid)]",
  violet: "from-[var(--cb-primary)] to-[var(--cb-mentor-end)]",
  cyan: "from-[var(--cb-brand-mid)] to-[var(--cb-teal)]",
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
        "flex h-[300px] flex-col overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center gap-[var(--cb-space-16)] bg-gradient-to-b",
          gradientClasses[gradient],
        )}
      >
        {badge ? <div className="absolute left-4 top-4">{badge}</div> : null}
        <span className="text-5xl font-bold leading-[48px] text-[color:var(--cb-text)]">
          {initials}
        </span>
        <div className="w-[calc(100%_-_48px)] rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:color-mix(in_srgb,var(--cb-surface)_90%,transparent)] p-[var(--cb-space-12)]">
          <p className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
            {name}
          </p>
          <p className="text-sm text-[color:var(--cb-text-muted)]">{role}</p>
        </div>
      </div>
      {footer ? (
        <div className="flex h-[var(--cb-size-64)] items-center gap-[var(--cb-space-8)] p-[var(--cb-space-12)] text-sm text-[color:var(--cb-text-muted)]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export { MemberCard };
