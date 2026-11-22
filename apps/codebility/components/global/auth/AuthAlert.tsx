import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export function AuthAlert({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-[10px] border border-[#5a2b2b] bg-[#291616] px-4 py-3.5 text-[14px] leading-5 text-[#f0c7c7]",
        className,
      )}
    >
      <CircleAlert
        aria-hidden
        className="mt-0.5 h-4 w-4 shrink-0 text-[#f0a9a9]"
      />
      <p>{children}</p>
    </div>
  );
}
