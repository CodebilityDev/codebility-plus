import React, { useEffect, useMemo, useState } from "react";
import { getTestDate } from "@/app/applicant/waiting/_service/util";

import { NewApplicantType } from "../_service/types";

export default function ApplicantTestTimeRemaining({
  applicant,
}: {
  applicant: NewApplicantType;
}) {
  const applicantData = applicant.applicant;

  const reapplyDate = useMemo(
    () => getTestDate(new Date(applicantData?.test_taken || "") || new Date()),
    [applicantData?.test_taken],
  );

  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const difference = reapplyDate.getTime() - now.getTime();
    const isExpired = difference <= 0;

    if (isExpired) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isExpired };
  });

  useEffect(() => {
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

  return (
    <div className="py-3 text-center text-sm text-gray-300">
      {!timeLeft.isExpired ? (
        <>
          {timeLeft.days > 0 && (
            <span>{`${timeLeft.days}d ${timeLeft.hours}h`}</span>
          )}
          {timeLeft.hours === 0 && timeLeft.minutes > 0 && (
            <span>{`${timeLeft.minutes}m`}</span>
          )}
          {timeLeft.minutes === 0 && timeLeft.seconds > 0 && (
            <span>{`${timeLeft.seconds}s`}</span>
          )}
        </>
      ) : (
        <span className="text-sm text-gray-500">Expired</span>
      )}
    </div>
  );
}
