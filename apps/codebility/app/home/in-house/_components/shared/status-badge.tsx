import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

export type InternalStatus =
  | "AVAILABLE"
  | "DEPLOYED"
  | "TRAINING"
  | "VACATION"
  | "BUSY"
  | "CLIENTREADY"
  | "BLOCKED"
  | "GRADUATED"
  | "FAILED";

export const STATUS_CONFIG: Record<
  InternalStatus,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Available",
    className: "bg-codeGreen/20 text-codeGreen border-codeGreen/20",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-codeViolet/20 text-codeViolet border-codeViolet/20",
  },
  TRAINING: {
    label: "Training",
    className: "bg-codeYellow/20 text-codeYellow border-codeYellow/20",
  },
  VACATION: {
    label: "Vacation",
    className: "bg-codeBlue/20 text-codeBlue border-codeBlue/20",
  },
  BUSY: {
    label: "Busy",
    className: "bg-codeRed/20 text-codeRed border-codeRed/20",
  },
  CLIENTREADY: {
    label: "Client Ready",
    className: "bg-codePurple/20 text-codePurple border-codePurple/20",
  },
  BLOCKED: {
    label: "Blocked",
    className: "bg-gray/20 text-gray border-gray/20",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-gray/20 text-gray border-gray/20",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-500/20 text-red-500 border-red-500/20",
  },
};

interface StatusBadgeProps {
  status: InternalStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.AVAILABLE;

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
