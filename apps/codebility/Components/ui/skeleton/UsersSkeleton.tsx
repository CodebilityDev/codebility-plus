import { Skeleton } from "@/Components/ui/skeleton/skeleton"

export function UsersSkeleton() {
  return (
    <div className="m-auto w-full max-w-5xl">
      <div className="grid place-items-center gap-4 xs:grid-cols-2 sm:place-items-start md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array(10)
          .fill(null)
          .map((value, index) => (
            <div key={index} className="mx-auto h-full w-full rounded-lg bg-black-100 lg:bg-transparent">
              <div className="flex flex-col items-center gap-2 rounded-lg p-4 text-center">
                <Skeleton className="bg-gray-300 aspect-square h-20 rounded-lg border" />
                <Skeleton className="bg-gray-300 h-4 w-16 rounded-lg border" />
                <Skeleton className="bg-gray-300 h-4 w-24 rounded-lg border" />
                <div className="flex flex-row items-center justify-center gap-2">
                  <Skeleton className="bg-gray-300 h-[18px] w-[18px] rounded-lg border" />
                  <Skeleton className="bg-gray-300 h-[18px] w-[18px] rounded-lg border" />
                  <Skeleton className="bg-gray-300 h-[18px] w-[18px] rounded-lg border" />
                </div>
                <Skeleton className="bg-gray-300 h-4 w-12 rounded-lg border" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
