import React, { useEffect, useMemo, useState } from "react";
import { getTestDate } from "@/app/applicant/waiting/_service/util";

import { NewApplicantType } from "../_service/types";

export default function ApplicantTestTimeRemaining({
  applicant,
  isMobile,
}: {
  applicant: NewApplicantType;
  isMobile?: boolean;
}) {
  const applicantData = applicant.applicant;

  const reapplyDate = useMemo(
    () => getTestDate(new Date(applicantData?.test_taken || "") || new Date()),
    [applicantData?.test_taken],
  );

  const isSubmitted = useMemo(
    () => applicantData?.fork_url !== null,
    [applicantData?.fork_url],
  );

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  } | null>(null);

  useEffect(() => {
    // Calculate initial time on client side
    const calculateTime = () => {
      const now = new Date();
      const difference = reapplyDate.getTime() - now.getTime();

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds, isExpired: false };
    };

    // Set initial value
    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      const now = new Date();
      const difference = reapplyDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    }, 1000);

    return () => clearInterval(interval);
  }, [reapplyDate]);

  // Show loading state during SSR
  if (!timeLeft) {
    return isMobile ? (
      <span className="text-sm text-gray-500">--</span>
    ) : (
      <div className="py-3 text-center text-sm text-gray-300">--</div>
    );
  }

  console.log("timeleft", timeLeft);

  const content =
    timeLeft.isExpired === false ? (
      <>
        {/* if days left */}
        {timeLeft.days > 0 && (
          <span>{`${timeLeft.days}d ${timeLeft.hours}h`}</span>
        )}

        {/* if hours left */}
        {timeLeft.days === 0 && timeLeft.hours > 0 && (
          <span>{`${timeLeft.hours}h`}</span>
        )}

        {/* if minutes left */}
        {timeLeft.hours === 0 && timeLeft.minutes > 0 && (
          <span>{`${timeLeft.minutes}m`}</span>
        )}

        {/* if secongs left */}
        {timeLeft.minutes === 0 && timeLeft.seconds > 0 && (
          <span>{`${timeLeft.seconds}s`}</span>
        )}
      </>
    ) : (
      <span className="text-sm text-gray-500">
        {isSubmitted ? "Submitted test" : "Expired"}
      </span>
    );

  return isMobile ? (
    content
  ) : (
    <div className="py-3 text-center text-sm text-gray-300">{content}</div>
  );
}
