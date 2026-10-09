import { ProfileMainSkeleton } from "@/components/marketing/profiles/ProfileMainSkeleton";
import { ProfileSidebarSkeleton } from "@/components/marketing/profiles/ProfileSidebarSkeleton";


export function ProfileDetailSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-6 md:gap-12 lg:mt-16 lg:flex-row">
      <ProfileSidebarSkeleton />
      <ProfileMainSkeleton />
    </div>
  );
}
