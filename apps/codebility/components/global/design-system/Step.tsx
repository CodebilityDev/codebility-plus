import { Check } from "lucide-react";

import { cn } from "@codevs/ui";

export type StepStatus = "done" | "active" | "upcoming";

const glassSurface =
  "border-[color:color-mix(in_srgb,var(--cb-white)_10%,transparent)] bg-[linear-gradient(105deg,color-mix(in_srgb,var(--cb-teal)_6%,transparent)_0%,var(--cb-glass)_55%,color-mix(in_srgb,var(--cb-white)_3%,transparent)_100%)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--cb-white)_8%,transparent)] backdrop-blur-[18px]";

const statusClasses: Record<StepStatus, string> = {
  done: glassSurface,
  active:
    "border-[color:color-mix(in_srgb,var(--cb-primary)_65%,transparent)] bg-[linear-gradient(105deg,color-mix(in_srgb,var(--cb-primary)_36%,transparent)_0%,color-mix(in_srgb,var(--cb-bg)_50%,transparent)_100%)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--cb-white)_8%,transparent),0_0_36px_color-mix(in_srgb,var(--cb-primary)_18%,transparent)] backdrop-blur-[18px]",
  upcoming: glassSurface,
};

const tileClasses: Record<StepStatus, string> = {
  done: "bg-[color:var(--cb-success)] text-[color:var(--cb-bg)]",
  active: "bg-[color:var(--cb-primary)] text-sm font-medium text-[color:var(--cb-text)]",
  upcoming:
    "border border-[color:color-mix(in_srgb,var(--cb-white)_12%,transparent)] bg-[color:var(--cb-glass)] text-sm font-medium text-[color:var(--cb-text-muted)]",
};

export interface StepProps {
  status: StepStatus;
  stepNumber: number;
  title: string;
  description?: string;
  meta?: string;
  className?: string;
}

function Step({
  status,
  stepNumber,
  title,
  description,
  meta,
  className,
}: StepProps) {
  const number = String(stepNumber).padStart(2, "0");

  return (
    <div
      className={cn(
        "relative z-10 flex min-h-[82px] items-start gap-[var(--cb-space-12)] rounded-[var(--cb-radius-16)] border p-[var(--cb-space-16)] lg:items-center",
        statusClasses[status],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-[var(--cb-size-44)] w-[var(--cb-size-44)] shrink-0 items-center justify-center rounded-[var(--cb-radius-12)]",
          tileClasses[status],
        )}
      >
        {status === "done" ? (
          <Check className="h-[var(--cb-size-12)] w-[var(--cb-size-12)]" strokeWidth={3} />
        ) : (
          number
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--cb-space-2)]">
        <div className="flex items-start justify-between gap-[var(--cb-space-8)]">
          <span className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
            {title}
          </span>
          {meta === undefined ? null : (
            <span className="shrink-0 whitespace-nowrap pt-[2px] text-xs font-medium text-[color:var(--cb-text-muted)]">
              {meta}
            </span>
          )}
        </div>
        {description === undefined ? null : (
          <span className="text-sm leading-5 text-[color:var(--cb-text-muted)]">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

export { Step };
