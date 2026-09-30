"use client";

import { useMemo } from "react";
import { useDeferredCountdown } from "@/hooks/global/useCountdown";
import { getTestDate } from "@/utils/global/applicant-waiting";
import type { ApplicantTestTimeRemainingProps } from "@/types/home/applicants/applicants";



export default function ApplicantTestTimeRemaining({
  applicant,
  isMobile,
}: ApplicantTestTimeRemainingProps) {
  const applicantData = applicant.applicant;

  const reapplyDate = useMemo(
    () => getTestDate(new Date(applicantData?.test_taken || "") || new Date()),
    [applicantData?.test_taken],
  );

  const isSubmitted = useMemo(
    () => applicantData?.fork_url !== null,
    [applicantData?.fork_url],
  );

  const timeLeft = useDeferredCountdown(reapplyDate);

  // Show loading state during SSR
  if (!timeLeft) {
    return isMobile ? (
      <span className="text-sm text-gray-500">--</span>
    ) : (
      <div className="text-sm text-gray-500">--</div>
    );
  }

  const getStatusColor = () => {
    if (timeLeft.isExpired) {
      return isSubmitted ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";
    }
    if (timeLeft.days === 0 && timeLeft.hours < 2) {
      return "text-orange-600 dark:text-orange-400";
    }
    return "text-gray-900 dark:text-gray-100";
  };

  const content =
    timeLeft.isExpired === false ? (
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {/* if days left */}
        {timeLeft.days > 0 && `${timeLeft.days}d ${timeLeft.hours}h`}

        {/* if hours left */}
        {timeLeft.days === 0 && timeLeft.hours > 0 && `${timeLeft.hours}h ${timeLeft.minutes}m`}

        {/* if minutes left */}
        {timeLeft.hours === 0 && timeLeft.minutes > 0 && `${timeLeft.minutes}m`}

        {/* if seconds left */}
        {timeLeft.minutes === 0 && timeLeft.seconds > 0 && `${timeLeft.seconds}s`}
      </span>
    ) : (
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {isSubmitted ? "Submitted" : "Expired"}
      </span>
    );

  return content;
}