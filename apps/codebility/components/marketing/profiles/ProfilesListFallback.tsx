import { ProfilesListSkeleton } from "@/components/marketing/profiles/ProfilesListSkeleton";
import { PAGE_SIZE } from "@/constants/marketing/profiles/profiles";

export function ProfilesListFallback() {
  return <ProfilesListSkeleton count={PAGE_SIZE} />;
}
