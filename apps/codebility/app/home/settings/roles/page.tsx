import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import RoleContainer from "./_components/role-container";
import { Role_Type } from "./_types/roles";

const RolesPage = async () => {
  const supabase = getSupabaseServerComponentClient();
  const { data } = await supabase.from("roles").select("*");

  const role = data || [];

  return (
    <>
      {data && data.length > 0 && <RoleContainer data={role as Role_Type[]} />}
    </>
  );
};

export default RolesPage;
