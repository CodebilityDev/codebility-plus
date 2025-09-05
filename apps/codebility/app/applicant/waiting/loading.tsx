import React from "react";

import { Skeleton } from "@codevs/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      {/* Progress steps */}
      <div className="mb-16 w-full max-w-4xl">
        <div className="relative flex items-center justify-between">
          {/* Step circles and lines */}
          <div className="flex w-full items-center">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center">
              <Skeleton className="h-8 w-8 rounded-full bg-cyan-500/20" />
              <Skeleton className="mt-2 h-4 w-16 bg-cyan-500/20" />
            </div>

            {/* Line between 1 and 2 */}
            <div className="mx-2 h-px flex-1">
              <Skeleton className="h-px w-full bg-cyan-500/20" />
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center">
              <Skeleton className="h-8 w-8 rounded-full bg-cyan-500/20" />
              <Skeleton className="mt-2 h-4 w-16 bg-cyan-500/20" />
            </div>

            {/* Line between 2 and 3 */}
            <div className="mx-2 h-px flex-1">
              <Skeleton className="h-px w-full bg-cyan-500/20" />
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center">
              <Skeleton className="h-8 w-8 rounded-full bg-cyan-500/20" />
              <Skeleton className="mt-2 h-4 w-16 bg-cyan-500/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="mb-16 flex max-w-md flex-col items-center justify-center">
        {/* Decorative circle/blob effect */}
        <div className="relative mb-8">
          <Skeleton className="h-24 w-24 rounded-full bg-indigo-500/20" />
        </div>

        {/* Title */}
        <Skeleton className="mb-6 h-8 w-64 bg-indigo-500/20" />

        {/* Description text */}
        <div className="text-center">
          <Skeleton className="mb-2 h-4 w-72 bg-indigo-500/20" />
          <Skeleton className="mb-2 h-4 w-80 bg-indigo-500/20" />
          <Skeleton className="h-4 w-64 bg-indigo-500/20" />
        </div>
      </div>
    </div>
  );
}
