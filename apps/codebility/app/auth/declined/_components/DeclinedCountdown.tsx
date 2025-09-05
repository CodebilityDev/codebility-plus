"use client";

import { useEffect, useMemo, useState } from "react";

import { getReApplyDate } from "../_service/util";

export const DeclinedCountdown = ({ userData }: { userData: any }) => {

  const reapplyDate = useMemo(
    () => getReApplyDate(userData?.date_applied),
    [userData?.date_applied],
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
    <div className="mb-6">
      {!timeLeft.isExpired ? (
        <>
          <p className="mb-2 text-lg font-semibold">
            Time until you can reapply:
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
          You may now reapply!
        </p>
      )}
    </div>
  );
};
