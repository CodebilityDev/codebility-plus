import { Roles } from "@/types/home/codev"; // Make sure your 'Roles' interface matches the DB columns


import RoleContainer from "./_components/RoleContainer";
import { createClientServerComponent } from "@/utils/supabase/server";

const RolesPage = async () => {
   const supabase = await createClientServerComponent();

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
