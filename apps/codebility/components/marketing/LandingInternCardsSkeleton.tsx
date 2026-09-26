"use client";

import { Skeleton } from "@/components/global/ui/skeleton";
import { CARD_COUNT } from "@/constants/marketing/marketing";

export function LandingInternCardsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl py-10" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex w-full flex-col items-center rounded-sm border border-neutral-700 bg-black-800"
            style={{ height: 270 }}
            aria-hidden="true"
          >
            <div className="flex h-full w-full flex-col items-center p-3 sm:p-4">
              <div className="flex items-center justify-center pb-0 pt-6">
                <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
              </div>
              <div className="flex w-full flex-grow flex-col items-center justify-center space-y-2 sm:space-y-3">
                <p className="invisible px-1 text-center text-xs font-medium leading-tight sm:px-2 sm:text-sm">
                  Member Name Here
                </p>
                <span className="invisible rounded-full px-2 py-1 text-xs font-medium sm:px-3">
                  Codev
                </span>
                <p className="invisible px-1 text-center text-xs leading-tight sm:px-2 sm:text-sm">
                  Developer
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
