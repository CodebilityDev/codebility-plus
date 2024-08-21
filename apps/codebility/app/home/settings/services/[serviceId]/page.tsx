import { createServer } from "@/utils/supabase";
import ServiceForm from "../_components/service-form";
import { getServiceById } from "../action"

const UpdateService = async ({ params }: { params: { serviceId: string } }) => {
  const { serviceId } = params;
  const service = await getServiceById(serviceId);
  const supabase = createServer();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return <p>Error fetching user</p>;
  }

  return <ServiceForm userId={user?.id} service={service.data} />
}

export default UpdateService