import { Skeleton } from "@/components/global/ui/skeleton";

export function ProfileMainSkeleton() {
  return (
    <div
      className="bg-black-500 flex basis-[70%] flex-col gap-6 rounded-lg p-6 text-white shadow-lg lg:gap-14 lg:p-8"
      aria-hidden="true"
    >
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded bg-white/10" />
          <Skeleton className="h-7 w-20 rounded bg-white/10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded bg-white/10" />
          <Skeleton className="h-4 w-11/12 rounded bg-white/10" />
          <Skeleton className="h-4 w-10/12 rounded bg-white/10" />
        </div>
      </div>

      <div>
        <Skeleton className="mb-4 h-7 w-28 rounded bg-white/10" />
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="bg-black-100 mb-4 rounded-lg p-6">
            <Skeleton className="mb-2 h-5 w-48 rounded bg-white/10" />
            <Skeleton className="h-4 w-64 rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div>
        <Skeleton className="mb-4 h-7 w-32 rounded bg-white/10" />
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="bg-black-100 mb-2 rounded-lg p-6">
            <Skeleton className="mb-2 h-5 w-40 rounded bg-white/10" />
            <Skeleton className="mb-2 h-4 w-56 rounded bg-white/10" />
            <Skeleton className="h-4 w-full rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
