import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import NavigationMain from "./marketing-navigation-main";
const Navigation = async () => {
  const supabase = getSupabaseServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isLoggedIn = user ? true : false

  return (
    <>
      <NavigationMain isLoggedIn={isLoggedIn} />
    </>
  );
};

export default Navigation;
