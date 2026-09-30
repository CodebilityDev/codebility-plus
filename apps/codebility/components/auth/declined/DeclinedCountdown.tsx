"use client";

import { useMemo } from "react";
import { useCountdown } from "@/hooks/global/useCountdown";

import { getReApplyDate } from "@/utils/global/auth-declined";
import type { DeclinedCountdownProps } from "@/types/auth/declined/declined";

export const DeclinedCountdown = ({ userData }: DeclinedCountdownProps) => {

  const reapplyDate = useMemo(
    () => getReApplyDate(userData?.date_applied),
    [userData?.date_applied],
  );

  const timeLeft = useCountdown(reapplyDate);

  return (
    <div className="mb-6">
      {!timeLeft?.isExpired ? (
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