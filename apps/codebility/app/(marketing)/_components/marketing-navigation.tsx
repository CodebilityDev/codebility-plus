import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import NavigationMain from "./marketing-navigation-main";
const Navigation = async () => {
  const supabase = getSupabaseServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isLoggedIn = user ? true : false


  const { data } = await supabase
  .from("profile")
  .select("*, user(*, user_type(*))")
  .eq("user_id", user?.id!)
  .single();

  
  const {
    first_name,
    last_name,
    image_url,
  } = data;


  console.log(image_url)


  return (
    <>
      <NavigationMain isLoggedIn={isLoggedIn} first_name={first_name} image_url={image_url}/>
    </>
  );
};

export default Navigation;
