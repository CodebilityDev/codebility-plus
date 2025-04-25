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
  INACTIVE: {
    label: "Inactive",
    className: "bg-status-inactive text-status-inactive-text",
  },
  MENTOR: {
    label: "Mentor",
    className: "bg-status-mentor text-status-mentor-text",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-status-admin text-status-admin-text",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-status-deployed text-status-deployed-text",
  },
};

interface StatusBadgeProps {
  status: InternalStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.MENTOR;

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
