import { InternalStatus } from "@/types/home/codev";

import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

const STATUS_CONFIG: Record<
  InternalStatus,
  { label: string; className: string }
> = {
  TRAINING: {
    label: "Training",
    className: "bg-yellow-200 text-yellow-700 border-yellow-200",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-green-200 text-green-700 border-green-200",
  },
  BUSY: {
    label: "Busy",
    className: "bg-red-200 text-red-700 border-red-200",
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-200 text-red-700 border-red-200",
  },
  AVAILABLE: {
    label: "Available",
    className: "bg-green-200 text-green-700 border-green-200",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-purple-200 text-purple-700 border-purple-200",
  },
  VACATION: {
    label: "Vacation",
    className: "bg-blue-200 text-blue-700 border-blue-200",
  },
  CLIENTREADY: {
    label: "Client Ready",
    className: "bg-violet-200 text-violet-700 border-violet-200",
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
