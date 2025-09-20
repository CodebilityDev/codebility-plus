import { getSidebarData } from "@/constants/sidebar";
import { createClientServerComponent } from "@/utils/supabase/server";
import LeftSidebarClient from "./LeftSidebarClient";

export default async function LeftSidebarServer() {
  const supabase = await createClientServerComponent();
  
  // Get user data server-side
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: userData } = await supabase
    .from("codev")
    .select("role_id, internal_status, availability_status")
    .eq("id", user.id)
    .single();
    
  if (!userData) return null;
  
  // Calculate roleId server-side
  const roleId = userData.internal_status === "INACTIVE" || 
                 userData.availability_status === false
    ? -1 
    : userData.role_id;
    
  // Fetch sidebar data once server-side
  const sidebarData = await getSidebarData(roleId);
  
  return <LeftSidebarClient initialSidebarData={sidebarData} />;
}