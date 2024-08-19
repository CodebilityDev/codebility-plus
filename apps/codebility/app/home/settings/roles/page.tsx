"use client"
import { H1 } from "@/Components/shared/dashboard"
import { Button } from "@/Components/ui/button"
import { useModal } from "@/hooks/use-modal"
import { IconAdd, ArrowRightIcon } from "@/public/assets/svgs"
import Link from "next/link"
import RoleListsTable from "@/app/home/settings/roles/components/RoleListsTable"

const RolesSetting = () => {
  const { onOpen } = useModal()

  return (
    <div className="flex max-w-[1600px] flex-col gap-6">
      <div className="text-dark100_light900 flex flex-col gap-4 ">
        <div className="flex flex-row items-center gap-4 text-sm">
          <Link href={"/settings"}>
            <span className="dark:text-white/50">Settings</span>
          </Link>
          <ArrowRightIcon />
          <span>Roles</span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <H1 className="mb-0 p-0 ">Role Lists</H1>
        <Button
          variant="default"
          className="w-auto"
          size="default"
          onClick={() => {
            onOpen("addRoleModal")
          }}
        >
          <IconAdd className="mr-2 h-2 w-2" />
          <span>Add New Role</span>
        </Button>
      </div>
      <RoleListsTable />
    </div>
  )
}

export default RolesSetting
