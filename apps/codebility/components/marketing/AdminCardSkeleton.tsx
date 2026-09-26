"use client";

import { Skeleton } from "@/components/global/ui/skeleton";

export function AdminCardSkeleton() {
  return (
    <div className="h-full" aria-hidden="true">
      <div className="flex h-full w-full flex-col gap-4 rounded-lg">
        <div className="relative h-[250px] w-full overflow-hidden rounded-lg bg-gray-800">
          <Skeleton className="absolute inset-0 h-full w-full rounded-lg bg-white/10" />
        </div>
        <div className="flex w-full flex-col gap-1">
          <p className="md:text-md invisible text-sm font-medium text-white lg:text-lg">
            Member Name
          </p>
          <div className="min-h-[2.5rem]">
            <p className="invisible text-sm text-gray-300 lg:text-base">
              Team Lead
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
