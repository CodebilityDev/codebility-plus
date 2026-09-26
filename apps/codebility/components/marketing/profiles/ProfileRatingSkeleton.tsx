import { Skeleton } from "@/components/global/ui/skeleton";

export function ProfileRatingSkeleton() {
  return (
    <div
      className="flex min-h-[24px] items-center justify-center gap-1"
      aria-busy="true"
      aria-hidden="true"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-6 w-6 rounded bg-white/10" />
      ))}
    </div>
  );
}
