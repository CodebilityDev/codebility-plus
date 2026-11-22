import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import type { ButtonProps } from "@/components/global/design-system/Button";

export interface AuthSubmitButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export function AuthSubmitButton({
  children,
  className,
  loading = false,
  loadingText = "Submitting...",
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <Button
      {...props}
      disabled={loading ? true : disabled}
      aria-busy={loading}
      className={cn(
        "h-[56px] w-full rounded-full bg-[#9747ff] text-[16px] font-medium text-white shadow-[0_0_34px_rgba(151,71,255,0.26)] hover:bg-[#a855f7]",
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
