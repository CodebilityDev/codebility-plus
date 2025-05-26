
import { createClientClientComponent } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useFetchEnum(schema_name: string, enum_name: string) {
  const client = createClientClientComponent();

  const queryFn = async () => {
    const { data, error } = await client.rpc("get_enum_values", {
      schema_name,
      enum_name,
    });

    if (error) throw error;

    return data.map((item: { enum_value: string }) => item.enum_value);
  };

  return useQuery({
    queryKey: [`${schema_name}.${enum_name}`],
    queryFn,
  });
}
