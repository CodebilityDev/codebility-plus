import { Suspense } from "react"
import CodevLists from "./_components/profile-lists"
import SectionWrapper from "@/Components/shared/home/SectionWrapper"
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton"
import ProfileContainer from "./_components/profile-container"
import { getCodevs } from "@/lib/server/codev.service"

export default async function Profiles() {
  const { data } = await getCodevs();

  const codevs = data || [];

  return (
    <SectionWrapper id="codevs" className="relative w-full bg-gradient-to-b from-black-500">
      <div className="absolute inset-0 bg-code-pattern bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <ProfileContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevLists codevs={codevs}/>
        </Suspense>
      </div>
    </SectionWrapper>
  )
}
