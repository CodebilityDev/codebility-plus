import React, { useEffect, useMemo, useState } from "react";
import { getReApplyDate } from "@/app/auth/declined/_service/util";

import { NewApplicantType } from "../_service/types";

export default function ApplicantReapplyTime({
  applicant,
  isMobile,
}: {
  applicant: NewApplicantType;
  isMobile?: boolean;
}) {
  const reapplyDate = useMemo(
    () =>
      applicant?.date_applied
        ? getReApplyDate(new Date(applicant.date_applied))
        : new Date(),
    [applicant?.date_applied],
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
      <span className="text-gray-300">--</span>
    ) : (
      <div className="py-3 text-center text-sm">
        <span className="text-gray-300">--</span>
      </div>
    );
  }

  const content = !timeLeft.isExpired ? (
    <div className="text-gray-300">
      <div className="flex justify-center space-x-1">
        <span>{timeLeft.days}d</span>
        <span>{timeLeft.hours}h</span>
        <span>{timeLeft.minutes}m</span>
      </div>
    </div>
  ) : (
    <span className="font-medium text-green-500">Available now</span>
  );

  return isMobile ? (
    content
  ) : (
    <div className="py-3 text-center text-sm">{content}</div>
  );
}
