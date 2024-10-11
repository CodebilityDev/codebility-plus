import { Codev } from "@/types/home/codev";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import InternContainer from "./_components/intern-container";

const Interns = async () => {
  const supabase = getSupabaseServerComponentClient();
  const [
    { data: interns, error: internsError },
    { data: profiles, error: profilesError },
  ] = await Promise.all([
    supabase.from("interns").select("*"),
    supabase.from("profile").select("*, user(*, codev(*), social(*))"),
  ]);

  if (internsError || profilesError) {
    return "Error fetching data";
  }

  const data = interns.map((intern) => {
    const profile = profiles.find((p) => p?.user_id === intern?.user_id);

    return {
      id: intern.id,
      email: intern.email,
      user_id: intern.user_id,
      first_name: intern.first_name,
      last_name: intern.last_name,
      image_url: profile.image_url,
      address: profile.address,
      about: profile.about,
      contact: profile.user.social.phone_no,
      education: profile.education,
      socials: profile.user.social,
      main_position: profile.main_position,
      internal_status: profile.user.codev.internal_status,
      tech_stacks: profile.tech_stacks,
      nda_status: profile.user.codev.nda_status,
      job_status: profile.user.codev.job_status,
      portfolio_website: profile.portfolio_website,
      type: profile.user.codev.type,
    };
  });

  // test deployment

  return (
    <>
      <InternContainer data={(data as Codev[]) || []} />
    </>
  );
};

export default Interns;
