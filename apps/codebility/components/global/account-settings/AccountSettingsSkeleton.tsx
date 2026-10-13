import { Skeleton } from "@/components/global/ui/skeleton";

export function AccountSettingsSkeleton() {
  return (
    <div
      className="grid gap-6 lg:grid-cols-2 p-2"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm background-box text-dark100_light900 h-fit space-y-4 p-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-3 w-72" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-11 w-28" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-3 w-80" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="w-full h-fit space-y-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm background-box text-dark100_light900 w-full border border-red-600 space-y-4 p-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm background-box text-foreground h-fit space-y-7 p-6">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-md p-3 space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <div className="flex flex-col sm:flex-row gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full sm:w-36" />
              </div>
              <Skeleton className="h-3 w-64" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-10" />
              </div>
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
