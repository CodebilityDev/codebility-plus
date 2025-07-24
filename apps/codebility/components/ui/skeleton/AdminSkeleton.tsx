import { Skeleton } from "@/components/ui/skeleton/skeleton";

export function AdminsSkeleton() {
  return (
    <div className="xs:grid-cols-2 grid gap-1 md:grid-cols-3 lg:grid-cols-4">
      {Array(8)
        .fill(null)
        .map((value, index) => (
          <div key={index} className="relative flex h-full w-full">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ))}
    </div>
  );
}
