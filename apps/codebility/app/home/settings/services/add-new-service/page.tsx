import { getCachedUser } from "@/lib/server/supabase-server-comp";

import ServiceForm from "../_components/service-form";
import { Category } from "../categories/_types/category";
import { getAllServiceCategories } from "../categories/service";

const AddNewService = async () => {
  const user = await getCachedUser();
  const categories = await getAllServiceCategories();

  if (!user) {
    console.error("Error fetching user");
    return <p>Error fetching user</p>;
  }

  return (
    <ServiceForm userId={user?.id} categories={categories as Category[]} />
  );
};

export default AddNewService;
