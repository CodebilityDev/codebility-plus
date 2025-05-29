"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/codev-store";
import { createClientClientComponent } from "@/utils/supabase/client";
import toast from "react-hot-toast";

// Initialize Supabase client

const Status = ({
  jobStatusType,
  userId,
  availabilityStatus,
}: {
  jobStatusType: string;
  userId: string;
  availabilityStatus: boolean;
}) => {
  const { user } = useUserStore();
  const [isChecked, setIsChecked] = useState(availabilityStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  let statusText;
  let statusColor;

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const updateSupabaseField = async (field: string, value: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("codev")
        .update({ [field]: value, updated_at: new Date() })
        .eq("id", userId);

      if (error) {
        console.error("Error updating status:", error.message);
        toast.error("Failed to update status.");
        return false;
      }

      toast.success("Status successfully updated.");
      return true;
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    const updated = await updateSupabaseField(
      "availability_status",
      !isChecked,
    );
    if (updated) {
      setIsChecked(!isChecked);
    }
  };

  const handleJobStatusChange = async () => {
    const jobStatus = isChecked ? "DEPLOYED" : "AVAILABLE";
    const updated = await updateSupabaseField("job_status", jobStatus);
    if (updated) {
      setIsChecked(!isChecked);
    }
  };

  if (!isChecked) {
    statusText = jobStatusType === "AVAILABLE" ? "Deployed" : "Unavailable";
    statusColor = "bg-orange-500";
  } else {
    statusText = jobStatusType === "AVAILABLE" ? "Available" : "Available";
    statusColor = "bg-green-500";
  }

  return (
    <label
      className={`inline-flex cursor-pointer items-center ${
        isLoading || (!user && "pointer-events-none opacity-50")
      }`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={isChecked}
        onChange={
          jobStatusType === "AVAILABLE"
            ? handleJobStatusChange
            : handleAvailabilityToggle
        }
        disabled={isLoading}
      />
      <div
        className={`peer relative h-9 w-24 rounded-full after:absolute after:left-1 after:top-1 after:h-7 after:w-7 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-[3.8rem] ${statusColor}`}
      >
        <span
          className={`absolute ${
            isChecked ? "left-[8%]" : "right-[8%]"
          } top-[50%] translate-y-[-52%] text-xs text-white`}
        >
          {statusText}
        </span>
      </div>
    </label>
  );
};

export default Status;
