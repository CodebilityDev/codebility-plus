"use client";

import { useMemo } from "react";
import { useCountdown } from "@/hooks/global/useCountdown";


import { getTestDate } from "@/utils/global/applicant-waiting";
import type { TestCountdownProps } from "@/types/applicant/waiting/waiting";

export const TestCountdown = ({
  applicantData,
}: TestCountdownProps) => {
  const reapplyDate = useMemo(
    () => getTestDate(new Date(applicantData?.test_taken ?? "") ?? new Date()),
    [applicantData?.test_taken],
  );

  const timeLeft = useCountdown(reapplyDate);

  return (
    <div className="mb-6">
      {!timeLeft?.isExpired ? (
        <>
          <p className="mb-2 text-lg font-semibold">
            Time until the deadline to submit your test:
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <span className="text-2xl font-bold">{timeLeft.days}</span> Days
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">{timeLeft.hours}</span> Hours
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">{timeLeft.minutes}</span>{" "}
              Minutes
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">{timeLeft.seconds}</span>{" "}
              Seconds
            </div>
          </div>
        </>
      ) : (
        <p className="text-lg font-semibold text-green-600">
          You have failed the test
        </p>
      )}
    </div>
  );
};