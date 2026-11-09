import { cn } from "@codevs/ui";

export type RoleBadgeRole = "admin" | "mentor" | "codev";

const roleClasses: Record<RoleBadgeRole, string> = {
  admin: "border-[color:color-mix(in_srgb,var(--cb-teal)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-teal)_10%,transparent)] text-[color:var(--cb-teal)]",
  mentor: "border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_18%,transparent)] text-[color:var(--cb-p200)]",
  codev: "border-[color:var(--cb-role-codev-border)] bg-[color:color-mix(in_srgb,var(--cb-blue)_10%,transparent)] text-[color:var(--cb-role-codev-text)]",
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
        "inline-flex h-[var(--cb-size-24)] items-center justify-center rounded-[var(--cb-radius-full)] border px-[var(--cb-space-12)] text-[11px] font-medium leading-4",
        roleClasses[role],
        className,
      )}
    >
      {label ?? roleLabels[role]}
    </span>
  );
}

export { RoleBadge };
