"use client";

import RoleListsTableDesktop from "@/app/home/settings/roles/_components/RoleListTableDesktop";
import RoleListsTableMobile from "@/app/home/settings/roles/_components/RoleListTableMobile";
import { Roles } from "@/types/home/codev";

export default function RoleListsTable({ roles }: { roles: Roles[] }) {
  return (
    <>
      <div className="hidden md:block">
        <RoleListsTableDesktop roles={roles} />
      </div>

      <div className="block md:hidden">
        <RoleListsTableMobile roles={roles} />
      </div>
    </>
  );
}
