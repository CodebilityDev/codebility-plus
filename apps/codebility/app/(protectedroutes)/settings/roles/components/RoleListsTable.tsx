import useAuth from "@/hooks/use-auth"
import { Box } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"

import RoleListsTableDesktop from "@/app/(protectedroutes)/settings/roles/components/RoleListsTableDesktop"
import RoleListsTableMobile from "@/app/(protectedroutes)/settings/roles/components/RoleListsTableMobile"

const RoleListsTable = () => {
  const { isLoading } = useAuth()
  return (
    <>
      {!isLoading ? (
        <>
          <div className="hidden md:block">
            <RoleListsTableDesktop />
          </div>

          <div className="block md:hidden">
            <RoleListsTableMobile />
          </div>
        </>
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
    </>
  )
}
export default RoleListsTable