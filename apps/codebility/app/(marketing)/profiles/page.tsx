import { Suspense } from "react";
import SectionWrapper from "@/Components/shared/home/SectionWrapper";
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton";
import { getAdmins, getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import ProfileContainer from "./_components/profile-container";
import CodevLists from "./_components/profile-lists";

import "./style.css";

export default async function Profiles() {
  const [{ data: codevs }, { data: admins }] = await Promise.all([
    getCodevs("INHOUSE"),
    getAdmins(),
  ]);

  const filteredCodevs = (codevs as Codev[]).filter(
    (codev) =>
      !(admins as Codev[]).some((admin) => admin.user_id === codev.user_id),
  );

  return (
    <SectionWrapper
      id="codevs"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <ProfileContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevLists codevs={filteredCodevs} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
