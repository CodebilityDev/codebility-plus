import { cn } from "@codevs/ui";

export type StatusBadgeStatus = "available" | "busy";

const statusClasses: Record<StatusBadgeStatus, string> = {
  available: "border-[color:color-mix(in_srgb,var(--cb-success)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-success)_10%,transparent)] text-[color:var(--cb-success-text)]",
  busy: "border-[color:color-mix(in_srgb,var(--cb-danger)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-danger)_10%,transparent)] text-[color:var(--cb-danger-text)]",
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
        "inline-flex h-[var(--cb-size-24)] items-center justify-center rounded-[var(--cb-radius-full)] border px-[var(--cb-space-12)] text-xs leading-[18px]",
        statusClasses[status],
        className,
      )}
    >
      {label ?? statusLabels[status]}
    </span>
  );
}

export { StatusBadge };
