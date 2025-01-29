import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import RoleContainer from "./_components/role-container";
import { Role_Type } from "./_types/roles";

const RolesPage = async () => {
  const supabase = getSupabaseServerComponentClient();

  // Fetch data from the "roles" table
  const { data, error } = await supabase.from("roles").select("*");

  if (error) {
    // Handle error (optional)
    console.error("Error fetching roles:", error);
  }

  const roles = data || [];

  return (
    <>{roles.length > 0 && <RoleContainer data={roles as Role_Type[]} />}</>
  );
};

export default RolesPage;
