import { cn } from "@codevs/ui";

export type RoleBadgeRole = "admin" | "mentor" | "codev";

const roleClasses: Record<RoleBadgeRole, string> = {
  admin: "border-[#02ffe2]/30 bg-[#02ffe2]/10 text-[#02ffe2]",
  mentor: "border-[#9747ff]/40 bg-[#9747ff]/[0.18] text-purple-200",
  codev: "border-blue-500/30 bg-blue-500/10 text-blue-300",
};

const roleLabels: Record<RoleBadgeRole, string> = {
  admin: "Admin",
  mentor: "Mentor",
  codev: "CoDev",
};

export interface RoleBadgeProps {
  role: RoleBadgeRole;
  label?: string;
  className?: string;
}

function RoleBadge({ role, label, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center justify-center rounded-full border px-3 text-[11px] font-medium leading-4",
        roleClasses[role],
        className,
      )}
    >
      {label ?? roleLabels[role]}
    </span>
  );
}

export { RoleBadge };
