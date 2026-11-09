import { Avatar } from "@/components/global/design-system/Avatar";
import type {
  AvatarGradient,
  AvatarSize,
} from "@/components/global/design-system/Avatar";
import { cn } from "@codevs/ui";

export interface AvatarStackItem {
  initials: string;
  src?: string;
  alt?: string;
  gradient?: AvatarGradient;
  online?: boolean;
}

export interface AvatarStackProps {
  items: AvatarStackItem[];
  max?: number;
  total?: number;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  32: "h-[var(--cb-size-32)] w-[var(--cb-size-32)]",
  40: "h-[var(--cb-size-40)] w-[var(--cb-size-40)]",
  48: "h-[var(--cb-size-48)] w-[var(--cb-size-48)]",
  56: "h-[var(--cb-size-56)] w-[var(--cb-size-56)]",
  72: "h-[var(--cb-size-72)] w-[var(--cb-size-72)]",
};

function AvatarStack({
  items,
  max = 4,
  total,
  size = 40,
  className,
}: AvatarStackProps) {
  const visible = items.slice(0, max);
  const count = total ?? items.length;
  const remaining = count - visible.length;

  return (
    <div
      role="group"
      aria-label={`${count} people`}
      className={cn("flex items-center", className)}
    >
      {visible.map((item, index) => (
        <span
          key={`${item.initials}-${index}`}
          className="-ml-2.5 rounded-[var(--cb-radius-full)] border-[3px] border-[color:var(--cb-bg)] first:ml-[var(--cb-space-0)]"
        >
          <Avatar {...item} size={size} />
        </span>
      ))}
      {remaining > 0 ? (
        <span
          className={cn(
            "-ml-2.5 flex items-center justify-center rounded-[var(--cb-radius-full)] border border-[color:var(--cb-bg)] bg-[color:var(--cb-surface-2)] text-xs text-[color:var(--cb-p200)]",
            sizeClasses[size],
          )}
        >
          +{remaining}
        </span>
      ) : null}
    </div>
  );
}

export { AvatarStack };
