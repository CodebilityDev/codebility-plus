import { Skeleton } from "@/components/global/ui/skeleton";

export function ServicesServiceCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08]"
      aria-hidden="true"
    >
      <div className="relative min-h-0 w-full flex-1">
        <Skeleton className="absolute inset-0 rounded-none bg-white/10" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Skeleton className="h-6 w-16 rounded-md bg-white/10" />
          <Skeleton className="h-6 w-20 rounded-md bg-white/10" />
        </div>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-gray-950/75 px-4 py-3">
          <Skeleton className="h-4 w-24 rounded bg-white/10" />
        </div>
      </div>
      <div className="flex shrink-0 items-center px-3 py-2.5">
        <Skeleton className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}
