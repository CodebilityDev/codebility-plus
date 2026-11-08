import { Check } from "lucide-react";

import { cn } from "@codevs/ui";

export type StepStatus = "done" | "active" | "upcoming";

const statusClasses: Record<StepStatus, string> = {
  done: "border-white/10 bg-white/[0.02]",
  active: "border-[#9747ff]/50 bg-[#9747ff]/[0.18]",
  upcoming: "border-white/10 bg-white/[0.02]",
};

const tileClasses: Record<StepStatus, string> = {
  done: "bg-[#4bce97] text-[#030303]",
  active: "bg-[#9747ff] text-sm font-medium text-white",
  upcoming: "bg-white/5 text-sm font-medium text-white/50",
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
        "flex h-[86px] items-center gap-4 rounded-2xl border p-4",
        statusClasses[status],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          tileClasses[status],
        )}
      >
        {status === "done" ? (
          <Check className="h-3 w-3" strokeWidth={3} />
        ) : (
          number
        )}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
          {title}
        </span>
        {description === undefined ? null : (
          <span className="text-sm text-white/50">{description}</span>
        )}
      </div>
      {meta === undefined ? null : (
        <span className="ml-auto shrink-0 whitespace-nowrap text-xs font-medium text-white/50">
          {meta}
        </span>
      )}
    </div>
  );
}

export { Step };
