import { Roles } from "@/types/home/codev"; // Make sure your 'Roles' interface matches the DB columns

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import RoleContainer from "./_components/role-container";

const RolesPage = async () => {
  const supabase = getSupabaseServerComponentClient();

  // Fetch data from the "roles" table
  const { data, error } = await supabase.from("roles").select("*");

  if (error) {
    console.error("Error fetching roles:", error);
    return <div>Error loading roles</div>;
  }

  const roles = data || [];

  return <>{roles.length > 0 && <RoleContainer data={roles as Roles[]} />}</>;
};

export default RolesPage;
