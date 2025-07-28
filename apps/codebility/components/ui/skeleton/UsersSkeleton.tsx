import { Skeleton } from "@/components/ui/skeleton/skeleton";

export function UsersSkeleton() {
  return (
    <div className="m-auto w-full max-w-5xl">
      <div className="xs:grid-cols-2 grid place-items-center gap-4 sm:place-items-start md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array(10)
          .fill(null)
          .map((value, index) => (
            <div
              key={index}
              className="bg-black-100 mx-auto h-full w-full rounded-lg lg:bg-transparent"
            >
              <div className="flex flex-col items-center gap-2 rounded-lg p-4 text-center">
                <Skeleton className="aspect-square h-20 rounded-lg border bg-gray-300" />
                <Skeleton className="h-4 w-16 rounded-lg border bg-gray-300" />
                <Skeleton className="h-4 w-24 rounded-lg border bg-gray-300" />
                <div className="flex flex-row items-center justify-center gap-2">
                  <Skeleton className="h-[18px] w-[18px] rounded-lg border bg-gray-300" />
                  <Skeleton className="h-[18px] w-[18px] rounded-lg border bg-gray-300" />
                  <Skeleton className="h-[18px] w-[18px] rounded-lg border bg-gray-300" />
                </div>
                <Skeleton className="h-4 w-12 rounded-lg border bg-gray-300" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
