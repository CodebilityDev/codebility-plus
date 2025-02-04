import { InternalStatus } from "@/types/home/codev";

import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

const STATUS_CONFIG: Record<
  InternalStatus,
  { label: string; className: string }
> = {
  TRAINING: {
    label: "Training",
    className: "bg-yellow-200 text-black border-yellow-200",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-green text-black border-green",
  },
  BUSY: {
    label: "Busy",
    className: "bg-red-200 border-red-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-200  border-red-200",
  },
  AVAILABLE: {
    label: "Available",
    className: "bg-green-200  border-green-200",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-purple-200  border-purple-200",
  },
  VACATION: {
    label: "Vacation",
    className: "bg-blue-200  border-blue-200",
  },
  CLIENTREADY: {
    label: "Client Ready",
    className: "bg-violet-200  border-violet-200",
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
