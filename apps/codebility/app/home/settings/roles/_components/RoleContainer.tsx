"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RoleListsTable from "@/app/home/settings/roles/_components/RoleListTable";
import { H1 } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ArrowRightIcon, IconAdd } from "@/public/assets/svgs";
import { Roles } from "@/types/home/codev";

export default function RoleContainer({ data }: { data: Roles[] }) {
  const { onOpen } = useModal();
  const [roles, setRoles] = useState<Roles[]>(data);

  useEffect(() => {
    setRoles(data);
  }, [data]);

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6">
      <div className="text-dark100_light900 flex flex-col gap-4">
        <div className="flex flex-row items-center gap-4 text-sm">
          <Link href={"/home/settings"}>
            <span className="dark:text-white/50">Settings</span>
          </Link>
          <ArrowRightIcon />
          <span>Roles</span>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-4">
        <H1 className="mb-0 p-0">Role Lists</H1>
        <Button
          variant="default"
          className="w-auto"
          size="default"
          onClick={() => onOpen("addRoleModal")}
        >
          <IconAdd className="mr-2 h-2 w-2" />
          <span>Add New Role</span>
        </Button>
      </div>

      <RoleListsTable roles={roles} />
    </div>
  );
}
