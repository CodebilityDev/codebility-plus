"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

export const DeclinedButtons = ({ userData }: { userData: any }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const createdAt = new Date(userData?.updated_at);
  const threeMonthsLater = new Date(
    createdAt.setMonth(createdAt.getMonth() + 3),
  );
  const canReapply = new Date() >= threeMonthsLater;

  const handleReapply = async () => {
    try {
      const { error } = await supabase
        .from("codev")
        .update({
          application_status: "applying",
          rejected_count: (userData.rejected_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userData.id);

      if (error) throw error;

      toast.success("Reapplication submitted");
      router.replace("/auth/waiting");
    } catch (error) {
      console.error("Error reapplying:", error);
      toast.error("Failed to reapply. Please try again.");
    }
  };

  return (
    <div className="flex items-center gap-10">
      {canReapply && (
        <Button
          onClick={handleReapply}
          className="from-teal to-violet h-10 w-28 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36"
        >
          <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
            Reapply
          </span>
        </Button>
      )}
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
