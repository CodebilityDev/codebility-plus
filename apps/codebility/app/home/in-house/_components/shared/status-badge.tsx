import { InternalStatus } from "@/types/home/codev";

import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

const STATUS_CONFIG: Record<
  InternalStatus,
  { label: string; className: string }
> = {
  TRAINING: {
    label: "Training",
    className: "bg-status-training text-status-training-text",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-status-graduated text-status-graduated-text",
  },
  BUSY: {
    label: "Busy",
    className: "bg-status-busy text-status-busy-text",
  },
  FAILED: {
    label: "Failed",
    className: "bg-status-failed text-status-failed-text",
  },
  AVAILABLE: {
    label: "Available",
    className: "bg-status-available text-status-available-text",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-status-deployed text-status-deployed-text",
  },
  VACATION: {
    label: "Vacation",
    className: "bg-status-vacation text-status-vacation-text",
  },
  CLIENTREADY: {
    label: "Client Ready",
    className: "bg-status-clientready text-status-clientready-text",
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
