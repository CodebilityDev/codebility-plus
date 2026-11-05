"use client";

import { useMemo } from "react";
import { useDeferredCountdown } from "@/hooks/global/useCountdown";
import { getReApplyDate } from "@/utils/global/auth-declined";
import type { ApplicantReapplyTimeProps } from "@/types/home/applicants/applicants";



export default function ApplicantReapplyTime({
  applicant,
}: ApplicantReapplyTimeProps) {
  const reapplyDate = useMemo(
    () =>
      applicant.date_applied
        ? getReApplyDate(new Date(applicant.date_applied))
        : new Date(),
    [applicant.date_applied],
  );

  const timeLeft = useDeferredCountdown(reapplyDate);

  // Show loading state during SSR
  if (!timeLeft) {
    return (
      <span className="text-sm text-gray-500">--</span>
    );
  }

  const content = !timeLeft.isExpired ? (
    <div className="flex items-center justify-center gap-1">
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    </div>
  ) : (
    <span className="text-sm font-medium text-green-600 dark:text-green-400">
      Available now
    </span>
  );

  return content;
}