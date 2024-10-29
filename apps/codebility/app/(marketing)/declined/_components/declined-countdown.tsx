"use client";

import { useEffect, useState } from "react";

import { DeclinedApplicant } from "../_types";

const DeclinedCountdown = ({ data }: { data: DeclinedApplicant }) => {
  const createdAt = new Date(data?.created_at);
  const reapplyDate = new Date(createdAt);
  reapplyDate.setMonth(reapplyDate.getMonth() + 3);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = reapplyDate.getTime() - now.getTime();

      const totalSeconds = Math.max(Math.floor(difference / 1000), 0);
      const d = Math.floor(totalSeconds / (3600 * 24));
      const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);

      if (difference <= 0) {
        clearInterval(interval);
        setIsExpired(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reapplyDate]);

  return (
    <div className="mb-6">
      {!isExpired ? (
        <>
          <p className="mb-2 text-lg font-semibold">
            Time until you can reapply:
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <span className="text-2xl font-bold">{days}</span> Days
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">{hours}</span> Hours
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">{minutes}</span> Minutes
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">{seconds}</span> Seconds
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

export default DeclinedCountdown;
