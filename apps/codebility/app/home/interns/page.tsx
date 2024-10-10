import { User } from "@/types";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import InternContainer from "./_components/intern-container";

const Interns = async () => {
  const supabase = getSupabaseServerComponentClient();
  const [
    { data: interns, error: internsError },
    { data: profiles, error: profilesError },
  ] = await Promise.all([
    supabase.from("interns").select("*"),
    supabase.from("profile").select("user_id, main_position, image_url"),
  ]);

  if (internsError || profilesError) {
    return "Error fetching data";
  }

  const data = interns.map((intern) => {
    const profile = profiles.find((p) => p?.user_id === intern?.user_id);

    return {
      ...intern,
      main_position: profile?.main_position || null,
      image_url: profile?.image_url || null,
    };
  });

  return (
    <>
      <InternContainer data={(data as User[]) || []} />
    </>
  );
};

export default Interns;
