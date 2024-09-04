import { createServer } from "@/utils/supabase";
import ServiceForm from "../_components/service-form";
import { getServiceById } from "../service"
import { getAllServiceCategories } from "../categories/service";
import { Category } from "../categories/_types/category";

const UpdateService = async ({ params }: { params: { serviceId: string } }) => {
  const { serviceId } = params;
  const service = await getServiceById(serviceId);
  const supabase = createServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  const categories = await getAllServiceCategories(); 

  if (error) {
    console.error("Error fetching user:", error);
    return <p>Error fetching user</p>;
  }

  return <ServiceForm userId={user?.id} service={service.data} categories={categories as Category[]} />
}

export default UpdateService