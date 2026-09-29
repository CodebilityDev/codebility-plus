import { getNavUserProfile } from "@/actions/global/nav-user";
import { NAV_USER_PROFILE_KEY } from "@/constants/global/marketing";
import { setLocalStorageValue } from "@/hooks/global/useLocalStorageValue";
import type { NavUserProfile } from "@/types/global/database";

// One request per page load, shared by the desktop menu and the mobile drawer.
let navUserPromise: Promise<NavUserProfile | null> | null = null;

export function getNavUserPromise() {
  if (!navUserPromise) {
    navUserPromise = getNavUserProfile().then((profile) => {
      if (profile) setLocalStorageValue(NAV_USER_PROFILE_KEY, profile);
      return profile;
    });
  }
  return navUserPromise;
}
