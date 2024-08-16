import { Box } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"

const Loading = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(6)
          .fill(null)
          .map((value, i) => (
            <Box key={i}>
              <div className="flex h-full flex-col justify-between">
                <div className="relative flex flex-col gap-1">
                  <Skeleton className="absolute right-0 top-0  h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="mt-2 flex flex-row justify-between gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-[30px] w-[30px] rounded-full" />
                </div>
              </div>
            </Box>
          ))}
      </div>
    </div>
  )
}

export default Loading
