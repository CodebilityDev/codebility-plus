import { Skeleton } from "@/components/ui/skeleton/skeleton";

const CARD_COUNT = 10;

export default function LandingInternSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto py-10" aria-busy="true">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex w-full flex-col items-center rounded-sm border border-neutral-700 bg-black-800"
            style={{ height: 270 }}
            aria-hidden="true"
          >
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 p-3">
              <Skeleton className="h-20 w-20 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-[70%] bg-white/10" />
              <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-[55%] bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
