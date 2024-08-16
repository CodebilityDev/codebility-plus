import dynamic from "next/dynamic"

import useAuth from "@/hooks/use-auth"
import { Box } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
const TimeTrackerTableDesktop = dynamic(() => import("./TimeTrackerTableDesktop"), { ssr: false })
const TimeTrackerTableMobile = dynamic(() => import("./TimeTrackerTableMobile"), { ssr: false })

const TimeTrackerTable = () => {
  const { isLoading } = useAuth()
  return (
    <>
      {!isLoading ? (
        <div className="hidden md:block">
          <TimeTrackerTableDesktop />
        </div>
      ) : (
        <Box className="h-70">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Box>
      )}
      <div className="block md:hidden">
        <TimeTrackerTableMobile />
      </div>
    </>
  )
}
export default TimeTrackerTable
