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
  32: "h-8 w-8",
  40: "h-10 w-10",
  56: "h-14 w-14",
  72: "h-[72px] w-[72px]",
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
          className="-ml-2.5 rounded-full border-[3px] border-[#030303] first:ml-0"
        >
          <Avatar {...item} size={size} />
        </span>
      ))}
      {remaining > 0 ? (
        <span
          className={cn(
            "-ml-2.5 flex items-center justify-center rounded-full border border-[#030303] bg-[#121214] text-xs text-purple-200",
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
