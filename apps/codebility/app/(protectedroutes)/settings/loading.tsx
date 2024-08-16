import Box from "@/Components/shared/dashboard/Box"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"

const Loading = () => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {Array(6)
        .fill(null)
        .map((_, index) => (
          <Box key={index} className="flex gap-2 lg:h-72 lg:flex-col lg:gap-3">
            <Skeleton className="h-auto w-1/2 rounded-lg lg:h-1/2 lg:w-full" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-8 w-1/2 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="hidden h-8 rounded-lg lg:block" />
            </div>
          </Box>
        ))}
    </div>
  )
}

export default Loading
