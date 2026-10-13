import { Skeleton } from "@/components/global/ui/skeleton";

export function NdaSigningSkeleton() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
      aria-busy="true"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-3/4 bg-gray-200" />
          <Skeleton className="mx-auto h-4 w-1/2 bg-gray-200" />
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200" />
            </div>
          </div>
          <Skeleton className="h-10 w-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
