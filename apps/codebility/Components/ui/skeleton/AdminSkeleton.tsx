import { Skeleton } from "@/Components/ui/skeleton/skeleton"

export function AdminsSkeleton() {
  return (
    <div className="grid gap-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array(8)
        .fill(null)
        .map((value, index) => (
          <div key={index} className="relative flex h-full w-full">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ))}
    </div>
  )
}