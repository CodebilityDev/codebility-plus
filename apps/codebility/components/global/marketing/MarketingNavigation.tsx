"use client";

import { Suspense, useState } from "react";

import useChangeBgNavigation from "@/hooks/global/useChangeBgNavigation";
import Logo from "@/components/global/typography/Logo";
import { CareersSignIn, MobileDrawer } from "@/components/global/marketing/MarketingNavigationSubComponents";
import dynamic from "next/dynamic";
import { signOut } from "@/actions/global/auth-session";
import { removeLocalStorageValue } from "@/hooks/global/useLocalStorageValue";


const UserMenu = dynamic(
  () =>
    import("@/components/global/marketing/MarketingNavigationSubComponents").then((m) => m.UserMenu),
  {
    ssr: false,
    loading: () => <CareersSignIn />,
  },
);
const DrawerAuthSection = dynamic(
  () =>
    import("@/components/global/marketing/MarketingNavigationSubComponents").then(
      (m) => m.DrawerAuthSection,
    ),
  {
    ssr: false,
    loading: () => null,
  },
);


const Navigation = () => {
  const { color } = useChangeBgNavigation();
  const [openSheet, setOpenSheet] = useState(false);

  const handleLogout = async () => { 
    try {
      await signOut();
    } finally {
      removeLocalStorageValue("user_profile")
    }
  }

  return (
    <div
      className={`fixed z-50 flex w-full items-center justify-center p-5 lg:px-12 ${
        color ? "bg-dark-500/55" : ""
      }`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full items-center gap-4">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <Suspense fallback={"Loading User Auth"}>
            <UserMenu handleLogout={handleLogout} />
          </Suspense>
          </div>
        <MobileDrawer
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
          drawerAuth={
            <Suspense fallback={"Loading User Auth"}>
              <DrawerAuthSection handleLogout={handleLogout} />        
            </Suspense>
        }
        />
      </div>
    </div>
  );
};

export default Navigation;