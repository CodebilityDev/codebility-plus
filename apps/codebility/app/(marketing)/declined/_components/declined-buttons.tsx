"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import toast from "react-hot-toast";

import { DeclinedApplicant } from "../_types";
import { reapply } from "../actions";

const DeclinedButtons = ({ data }: { data: DeclinedApplicant }) => {
  const router = useRouter();
  const createdAt = new Date(data?.created_at);
  const threeMonthsLater = new Date(
    createdAt.setMonth(createdAt.getMonth() + 3),
  );

  const currentDate = new Date();
  const canReapply = currentDate >= threeMonthsLater;

  const handleReapply = async (data: DeclinedApplicant) => {
    try {
      const response = await reapply(data);
      if (response.success) {
        toast.success("Reapply successful");
        router.replace("/waiting");
      } else {
        console.log("Error reapplying: ", response.error);
        toast.error(response.error as string);
      }
    } catch (error) {
      console.log("Error reapplying: ", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center gap-10">
      {canReapply && (
        <Button
          type="button"
          onClick={() => handleReapply(data)}
          className="from-teal to-violet h-10 w-28 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36"
        >
          <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
            Reapply
          </span>
        </Button>
      )}
      <Button
        type="button"
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

export default DeclinedButtons;
