"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { reApplyAction } from "../_service/actions";
import { getCanReApply } from "../_service/util";

export const DeclinedButtons = ({ userData }: { userData: any }) => {
  const router = useRouter();

  const canReapply = useMemo(
    () => getCanReApply(userData?.date_applied),
    [userData?.date_applied],
  );

  const handleReapply = async () => {
    try {
      await reApplyAction({ user: userData });

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
          "from-teal to-violet h-10 w-28 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36",
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
        className="from-teal to-violet h-10 w-28 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br md:w-36 xl:h-12"
      >
        <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
          Go to Home
        </span>
      </Button>
    </div>
  );
};
