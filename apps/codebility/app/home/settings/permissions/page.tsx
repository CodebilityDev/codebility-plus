import Link from "next/link";
import { Box, H1 } from "@/Components/shared/dashboard";
import { ArrowRightIcon } from "@/public/assets/svgs";


import PermissionsTable from "./_components/PermissionsTable";
import { permissions_TableRowProps as TableRowProps } from "./_types/permissions";
import { createClientServerComponent } from "@/utils/supabase/server";

const PermissionSettings = async () => {
  const supabase = await createClientServerComponent();
  const { data: Roles, error } = await supabase.from("user_type").select("*");

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-6 overflow-x-auto">
      <div className="text-dark100_light900 flex flex-col gap-4 ">
        <div className="flex flex-row items-center gap-4 text-sm">
          <Link href={"/home/settings"}>
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
        {error ? (
          <div>Error</div>
        ) : (
          <PermissionsTable Roles={Roles as TableRowProps[]} />
        )}
      </Box>
    </div>
  );
};

export default PermissionSettings;
