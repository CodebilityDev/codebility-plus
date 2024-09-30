import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import RoleContainer from "./_components/role-container";
import { Role } from "./_types/roles";

const RolesPage = async () => {
  const supabase = getSupabaseServerComponentClient();
  const { data } = await supabase.from("roles").select("*");

  return (
    <>
      {" "}
      {data && data.length > 0 && (
        <RoleContainer data={(data as Role[]) || []} />
      )}
    </>
  );
};

export default RolesPage;
