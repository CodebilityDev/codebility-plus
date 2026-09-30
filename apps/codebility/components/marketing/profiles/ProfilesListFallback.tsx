import CodevContainer from "@/components/marketing/profiles/CodevContainer";
import { ProfilesListSkeleton } from "@/components/marketing/profiles/ProfilesListSkeleton";
import { PAGE_SIZE } from "@/constants/marketing/profiles/profiles";

export function ProfilesListFallback() {
  return (
    <div className="relative flex flex-col gap-8 z-10">
      <CodevContainer />
      <ProfilesListSkeleton count={PAGE_SIZE} />
    </div>
  );
}
