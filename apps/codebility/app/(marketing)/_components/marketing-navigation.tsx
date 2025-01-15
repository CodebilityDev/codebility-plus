import { getCachedUser } from "@/lib/server/supabase-server-comp";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import NavigationMain from "./marketing-navigation-main";

const Navigation = async () => {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCachedUser();

  const isLoggedIn = user ? true : false;

  let data = null;

  if (user) {
    const { data: userData } = await supabase
      .from("profile")
      .select("*, user(*, user_type(*))")
      .eq("user_id", user?.id!)
      .single();

    data = userData;
  }

  // Destructure with fallback
  const {
    first_name = "",
    last_name = "",
    image_url = "",
    user: { email = "" } = {}, // Fallback for user object
  } = data || {};

  return (
    <>
      <NavigationMain
        isLoggedIn={isLoggedIn}
        first_name={first_name}
        last_name={last_name}
        image_url={image_url}
        email={email}
      />
    </>
  );
};

export default Navigation;
