import { getSidebarData } from "@/constants/sidebar";
import { createClientServerComponent } from "@/utils/supabase/server";
import LeftSidebarClient from "./LeftSidebarClient";

export default async function LeftSidebarServer() {
  const supabase = await createClientServerComponent();
  
  // Get user data server-side
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  
  if (!user) {
    const sidebarData = await getSidebarData(null);
    return <LeftSidebarClient initialSidebarData={sidebarData} />;
  }
  
  const { data: userData } = await supabase
    .from("codev")
    .select("role_id, internal_status, availability_status")
    .eq("id", user.id)
    .single();
    
  if (!userData) {
    // Fallback if user exists in auth but not in codev table
    const sidebarData = await getSidebarData(null);
    return <LeftSidebarClient initialSidebarData={sidebarData} />;
  }
  
  // Calculate roleId server-side
  const roleId = userData.internal_status === "INACTIVE" || 
                 userData.availability_status === false
    ? -1 
    : userData.role_id;
    
  // Fetch sidebar data once server-side
  const sidebarData = await getSidebarData(roleId);
  
  return <LeftSidebarClient initialSidebarData={sidebarData} />;
}