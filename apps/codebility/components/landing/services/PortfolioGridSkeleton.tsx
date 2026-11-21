import { Skeleton } from "@codevs/ui/skeleton";

export function PortfolioGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading projects"
      className="grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 xl:grid-cols-3"
    >
      <span className="sr-only">Loading projects</span>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={
            "overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[#0B0B0D] " +
            (index === 1 ? "hidden sm:block" : index > 1 ? "hidden xl:block" : "")
          }
        >
          <Skeleton className="aspect-[16/10] w-full rounded-none border-b border-[color:var(--cb-border)]" />
          <div className="flex flex-col gap-[var(--cb-space-8)] p-[var(--cb-space-20)]">
            <Skeleton className="h-5 w-2/3 rounded-[4px]" />
            <Skeleton className="h-[19px] w-full rounded-[4px]" />
            <Skeleton className="h-[19px] w-4/5 rounded-[4px]" />
            <div className="mt-[var(--cb-space-12)] flex items-center justify-between">
              <Skeleton className="h-6 w-16 rounded-[6px]" />
              <Skeleton className="h-5 w-24 rounded-[4px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
