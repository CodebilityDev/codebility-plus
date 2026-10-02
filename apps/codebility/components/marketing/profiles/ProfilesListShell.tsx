import CodevContainer from "@/components/marketing/profiles/CodevContainer";
import { ProfilesListBody } from "@/components/marketing/profiles/ProfilesListBody";
import type { ProfilesListShellProps } from "@/types/marketing/profiles/profiles";

export default function ProfilesListShell({
  initialData,
  pageSize,
}: ProfilesListShellProps) {
  return (
    <div className="relative flex flex-col gap-8 z-10">
      <CodevContainer />
      <ProfilesListBody initialData={initialData} pageSize={pageSize} />
    </div>
  );
}
