import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type AuthStatusTone = "brand" | "danger" | "success";

const toneClasses: Record<AuthStatusTone, string> = {
  brand: "border-[#9747ff]/25 bg-[#1c102c] text-[#c084fc]",
  danger: "border-[#6b3030] bg-[#2a1515] text-[#f0a9a9]",
  success: "border-[#2b5b41] bg-[#10251a] text-[#7be0b6]",
};

export interface AuthStatusPanelProps {
  icon: LucideIcon;
  tone?: AuthStatusTone;
  title: string;
  description: ReactNode;
  children?: ReactNode;
}

export function AuthStatusPanel({
  icon: Icon,
  tone = "brand",
  title,
  description,
  children,
}: AuthStatusPanelProps) {
  return (
    <div className="w-full">
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-[14px] border",
          toneClasses[tone],
        )}
      >
        <Icon aria-hidden className="h-6 w-6" />
      </span>

      <h1 className="mt-9 text-[40px] font-bold leading-[1.08] tracking-[-0.04em]">
        {title}
      </h1>
      <div className="mt-4 max-w-[420px] text-[15px] leading-6 text-white/65">
        {description}
      </div>

      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
