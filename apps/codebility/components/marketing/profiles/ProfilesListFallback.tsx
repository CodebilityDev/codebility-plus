import ProfilesListShell from "@/components/marketing/profiles/ProfilesListShell";
import { PAGE_SIZE } from "@/constants/marketing/profiles/profiles";

export function ProfilesListFallback() {
  return <ProfilesListShell loading pageSize={PAGE_SIZE} />;
}
