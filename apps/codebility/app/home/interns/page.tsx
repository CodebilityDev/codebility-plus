import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";


import { User } from "@/types";
import InternContainer from "./_components/intern-container";

const Interns = async () => {
  const supabase = getSupabaseServerComponentClient();
  const { data: interns, error } = await supabase.from("interns").select("*");

  return (
    <>
      {error ? "error" : <InternContainer data={(interns as User[]) || []} />}
    </>
  );
};

export default Interns;