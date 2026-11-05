"use client";

import { AdminCardSkeleton } from "@/components/marketing/AdminCardSkeleton";
import BlueBg from "@/components/marketing/LandingBlueBg";
import type { AdminsSectionSkeletonProps } from "@/types/marketing/marketing";

export function AdminsSectionSkeleton({
  title,
  description,
  cardCount,
}: AdminsSectionSkeletonProps) {
  return (
    <div>
      <h1 className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-3xl font-bold text-transparent">
        {title}
      </h1>

      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p className="pt-8 text-center text-gray-300 md:px-44">{description}</p>

          <div>
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          </div>

          <div
            className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4"
            aria-hidden="true"
          >
            {Array.from({ length: cardCount }).map((_, index) => (
              <div key={index} className="relative h-full">
                <AdminCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
