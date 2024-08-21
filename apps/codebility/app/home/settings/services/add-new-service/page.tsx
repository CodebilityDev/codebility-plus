import { createServer } from "@/utils/supabase";
import ServiceForm from "../_components/service-form";

 const AddNewService = async () => {
  const supabase = createServer();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return <p>Error fetching user</p>;
  }

  return <ServiceForm userId={user?.id} />
}

export default AddNewService