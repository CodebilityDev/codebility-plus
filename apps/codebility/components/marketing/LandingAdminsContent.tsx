import AnimatedAdminsSection from "@/components/marketing/AnimatedAdminsSection";
import { ADMINS_SECTION_COPY } from "@/constants/marketing/admins-section-copy";
import { getCachedLandingAdminsData } from "@/lib/global/landing-admins-cached";

export async function LandingAdminsContent() {
  const data = await getCachedLandingAdminsData();
  if (!data) return <div>ERROR</div>;

  return (
    <>
      <AnimatedAdminsSection
        {...ADMINS_SECTION_COPY.admins}
        members={data.admins}
        sectionId="admins"
      />

      <div className="mt-20">
        <AnimatedAdminsSection
          {...ADMINS_SECTION_COPY.mentors}
          members={data.mentors}
          sectionId="mentors"
        />
      </div>
    </>
  );
}
