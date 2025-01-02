import { getCachedUser } from "@/lib/server/supabase-server-comp";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import ServiceForm from "../_components/service-form";
import { Category } from "../categories/_types/category";
import { getAllServiceCategories } from "../categories/service";
import { getServiceById } from "../service";

const UpdateService = async ({ params }: { params: { serviceId: string } }) => {
  const { serviceId } = params;
  const service = await getServiceById(serviceId);
  const user = await getCachedUser();
  const categories = await getAllServiceCategories();

  if (!user) {
    console.error("Error fetching user");
    return <p>Error fetching user</p>;
  }

  return (
    <ServiceForm
      userId={user?.id}
      service={service.data}
      categories={categories as Category[]}
    />
  );
};

export default UpdateService;
