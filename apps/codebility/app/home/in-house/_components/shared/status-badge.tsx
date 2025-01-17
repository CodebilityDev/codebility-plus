import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

const STATUS_CONFIG = {
  AVAILABLE: {
    label: "Available",
    className: "bg-green-500/20 text-green-500",
  },
  DEPLOYED: {
    label: "Deployed",
    className: "bg-yellow-500/20 text-yellow-500",
  },
  TRAINING: {
    label: "Training",
    className: "bg-blue-500/20 text-blue-500",
  },
  VACATION: {
    label: "Vacation",
    className: "bg-purple-500/20 text-purple-500",
  },
  BUSY: {
    label: "Busy",
    className: "bg-red-500/20 text-red-500",
  },
  CLIENT_READY: {
    label: "Client Ready",
    className: "bg-gray-500/20 text-gray-500",
  },
  BLOCKED: {
    label: "Blocked",
    className: "bg-gray-500/20 text-gray-500",
  },
  GRADUATED: {
    label: "Graduated",
    className: "bg-gray-500/20 text-gray-500",
  },
} as const;

interface StatusBadgeProps {
  status: keyof typeof STATUS_CONFIG;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.AVAILABLE;

  return (
    <Badge className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  );
}
