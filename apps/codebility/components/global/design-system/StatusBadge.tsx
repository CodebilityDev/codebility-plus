import { cn } from "@codevs/ui";

export type StatusBadgeStatus = "available" | "busy";

const statusClasses: Record<StatusBadgeStatus, string> = {
  available: "border-[#4bce97]/30 bg-[#4bce97]/10 text-[#7be0b6]",
  busy: "border-[#d45454]/30 bg-[#d45454]/10 text-[#f08a8a]",
};

const statusLabels: Record<StatusBadgeStatus, string> = {
  available: "Available",
  busy: "Busy",
};

export interface StatusBadgeProps {
  status: StatusBadgeStatus;
  label?: string;
  className?: string;
}

function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center justify-center rounded-full border px-3 text-xs leading-[18px]",
        statusClasses[status],
        className,
      )}
    >
      {label ?? statusLabels[status]}
    </span>
  );
}

export { StatusBadge };
