import { createServer } from "@/utils/supabase";
import ServiceForm from "../_components/service-form";
import { getAllServiceCategories } from "../categories/service";
import { Category } from "../categories/_types/category";

 const AddNewService = async () => {
  const supabase = createServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  const categories = await getAllServiceCategories(); 

  if (error) {
    console.error("Error fetching user:", error);
    return <p>Error fetching user</p>;
  }

  return <ServiceForm userId={user?.id} categories={categories as Category[]} />
}

export default AddNewService