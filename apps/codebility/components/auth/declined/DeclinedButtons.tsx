"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/global/ui/button";
import { cn } from "@/utils/global/cn";
import toast from "react-hot-toast";
import { reApplyAction } from "@/actions/global/auth-declined";
import { getCanReApply } from "@/utils/global/auth-declined";
import type { DeclinedButtonsProps } from "@/types/auth/declined/declined";

export const DeclinedButtons = ({ userData }: DeclinedButtonsProps) => {
  const router = useRouter();
  const dateApplied = (userData as { date_applied?: string | null } | null | undefined)?.date_applied;

  const canReapply = useMemo(
    () => getCanReApply(dateApplied ? new Date(dateApplied) : null),
    [dateApplied],
  );

  const handleReapply = async () => {
    try {
      await reApplyAction();

      toast.success("Reapplication submitted");
    } catch (error) {
      console.error("Error reapplying:", error);
      toast.error("Failed to reapply. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-10">
      <Button
        onClick={handleReapply}
        className={cn(
          "from-customTeal to-customViolet-100 h-10 w-28 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36",
          canReapply ? "cursor-pointer" : "cursor-not-allowed",
        )}
        disabled={!canReapply}
      >
        <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
          Reapply
        </span>
      </Button>

      <Button
        onClick={() => router.replace("/")}
        className="from-customTeal to-customViolet-100 h-10 w-28 rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 hover:bg-gradient-to-br md:w-36 xl:h-12"
      >
        <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
          Go to Home
        </span>
      </Button>
    </div>
  );
};
