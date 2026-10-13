"use client";

import { DialogHeader, DialogTitle } from "@/components/global/ui/dialog";
import { VisuallyHidden } from "@/components/marketing/services/visuallyHidden";

export function ServiceDetailSkeleton() {
  return (
    <>
      <DialogHeader
        id="service-detail-header"
        className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-2"
      >
        <DialogTitle>
          <VisuallyHidden>Loading project</VisuallyHidden>
        </DialogTitle>
        <div className="mx-auto h-7 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-8 sm:w-56" />
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
        <div className="mb-6 h-[200px] w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700 sm:h-[300px]" />

        <div className="space-y-6">
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 sm:p-6">
            <div className="mb-4 h-6 w-44 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-7 sm:w-52" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-48" />
              <div className="h-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-48" />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 sm:p-6">
            <div className="mb-4 h-6 w-36 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 sm:h-7 sm:w-40" />
            <div className="flex gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
