import { Skeleton } from "@/components/ui/skeleton/skeleton";

export function CodevsProfilesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div
      className="grid h-full w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex h-80 flex-col items-center justify-between rounded-lg border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md"
          aria-hidden="true"
        >
          <div className="grid w-full grid-cols-4 gap-2">
            <div className="col-span-1" />
            <div className="col-span-2 flex justify-center">
              <Skeleton className="h-24 w-24 rounded-full bg-white/10" />
            </div>
            <div className="col-span-1 flex justify-end">
              <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <Skeleton className="h-5 w-32 rounded bg-white/10" />
            <Skeleton className="h-4 w-24 rounded bg-white/10" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full bg-white/10" />
          <Skeleton className="h-9 w-24 rounded-full bg-white/10" />
        </div>
      ))}
    </div>
  );
}
