import { Skeleton } from "@/components/global/ui/skeleton";

export default function WaitingSkeleton() {
  return (
    <section
      aria-busy="true"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-8 px-6"
    >
      <div className="flex w-full max-w-3xl items-center justify-between gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-10 w-10 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32 w-full max-w-3xl" />
    </section>
  );
}
