import RoleListsTableDesktop from "@/app/home/settings/roles/_components/role-list-table-desktop";
import RoleListsTableMobile from "@/app/home/settings/roles/_components/role-list-table-mobile";

import { Role } from "../_types/roles";

const RoleListsTable = ({ roles }: { roles: Role[] }) => {
  return (
    <>
      <>
        <div className="hidden md:block">
          <RoleListsTableDesktop roles={roles as Role[]} />
        </div>

        <div className="block md:hidden">
          <RoleListsTableMobile roles={roles as Role[]} />
        </div>
      </>
      {/* ) : ( */}
      {/* <Box className="h-70">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Box> */}
      {/* )} */}
    </>
  );
};
export default RoleListsTable;
