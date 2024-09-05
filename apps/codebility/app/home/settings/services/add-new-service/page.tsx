import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import ServiceForm from "../_components/service-form";
import { Category } from "../categories/_types/category";
import { getAllServiceCategories } from "../categories/service";

const AddNewService = async () => {
  const supabase = getSupabaseServerComponentClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const categories = await getAllServiceCategories();

  if (error) {
    console.error("Error fetching user:", error);
    return <p>Error fetching user</p>;
  }

  return (
    <ServiceForm userId={user?.id} categories={categories as Category[]} />
  );
};

export default AddNewService;
