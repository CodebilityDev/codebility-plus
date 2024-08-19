import { Box, H1 } from "@/Components/shared/dashboard"
import PermissionsTable from "@/app/home/settings/permissions/PermissionsTable"
import { ArrowRightIcon } from "@/public/assets/svgs"
import Link from "next/link"

const PermissionSettings = () => {
  return (
    <div className="flex max-w-[1600px] flex-col gap-6 overflow-x-auto">
      <div className="text-dark100_light900 flex flex-col gap-4 ">
        <div className="flex flex-row items-center gap-4 text-sm">
          <Link href={"/settings"}>
            <span className="dark:text-white/50">Settings</span>
          </Link>
          <ArrowRightIcon />
          <span>Permissions</span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <H1>Permissions</H1>
      </div>
      <Box className="p-0">
        <PermissionsTable />
      </Box>
    </div>
  )
}

export default PermissionSettings
