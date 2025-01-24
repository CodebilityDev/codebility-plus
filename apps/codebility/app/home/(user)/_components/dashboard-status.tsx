"use client";

import React, { useState } from "react";
import { toggleJobStatusType } from "@/app/api/dashboard";
import { useUserStore } from "@/store/codev-store";
import toast from "react-hot-toast";

const Status = ({
  jobStatusType,
  userId,
}: {
  jobStatusType: string;
  userId: string;
}) => {
  const { user } = useUserStore();
  const [isChecked, setIsChecked] = useState(jobStatusType === "AVAILABLE");
  const [isLoading, setIsLoading] = useState(false);

  let statusText;
  let statusColor;

  const changeJobStatus = async (jobStatus: string) => {
    try {
      setIsLoading(true);
      const jobStatusToggle = await toggleJobStatusType({
        id: userId,
        jobStatusType: jobStatus,
      });
      return { ...jobStatusToggle, status: true };
    } catch (e) {
      setIsLoading(false);
      return { status: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async () => {
    if (!user || user.role_id !== 1) {
      toast.error("Only admins can perform this action.");
      return;
    }

    const { status } = await changeJobStatus(
      isChecked ? "DEPLOYED" : "AVAILABLE",
    );
    if (!status) {
      toast.error("Failed to change job status.");
      return;
    }
    setIsChecked(!isChecked);
    toast.success("Job status successfully changed.");
  };

  if (!isChecked) {
    statusText = "Deployed";
    statusColor = "bg-orange-500";
  } else {
    statusText = "Available";
    statusColor = "bg-green-500";
  }

  return (
    <label
      className={`inline-flex cursor-pointer items-center ${
        isLoading || (user?.role_id !== 1 && "pointer-events-none opacity-50")
      }`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={isChecked}
        onChange={handleChange}
        disabled={isLoading || user?.role_id !== 1}
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
