import { cache, Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { createClientServerComponent } from "@/utils/supabase/server";

import Navigation, {
  CareersSignIn,
  DrawerAuthSection,
  UserMenu,
  type NavUserData,
} from "./MarketingNavigation";

const getMarketingNavUser = cache(async (): Promise<NavUserData> => {
  const supabase = await createClientServerComponent();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const { data: userRow, error: fetchError } = await supabase
    .from("codev")
    .select(`*, applicant (id, codev_id)`)
    .eq("id", user.id)
    .single();

  if (fetchError) {
    console.error("Error fetching codev:", fetchError.message);
    return null;
  }

  return userRow;
});

const MarketingSCUserMenu = async () => {
  const userData = await getMarketingNavUser();
  if (!userData) return <CareersSignIn />;
  return <UserMenu {...userData} handleLogout={signOut} />;
};

const MarketingSCDrawerAuth = async () => {
  const userData = await getMarketingNavUser();
  if (!userData) return null;
  return <DrawerAuthSection userData={userData} handleLogout={signOut} />;
};

const MarketingSCNavigation = () => (
  <Navigation
    userMenu={
      <Suspense fallback={null}>
        <MarketingSCUserMenu />
      </Suspense>
    }
    drawerAuth={
      <Suspense fallback={null}>
        <MarketingSCDrawerAuth />
      </Suspense>
    }
  />
);

export default MarketingSCNavigation;
