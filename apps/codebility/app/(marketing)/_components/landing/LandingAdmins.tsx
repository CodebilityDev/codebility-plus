import { Suspense } from "react";
import { getCachedLandingAdminsData } from "@/lib/server/landing-admins-cached";

import Section from "../MarketingSection";
import AnimatedAdminsSection from "./AnimatedAdminsSection";
import { LandingAdminsSkeleton } from "./LandingAdminsSkeleton";
import { ADMINS_SECTION_COPY } from "../../_lib/constants";

async function LandingAdminsContent() {
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

export default function Admins() {
  return (
    <Section id="admins" className="text-light-900 relative w-full pt-10">
      <div data-landing-section>
        <div data-landing-skeleton>
          <LandingAdminsSkeleton />
        </div>
        <div data-landing-content>
          <Suspense fallback={<LandingAdminsSkeleton />}>
            <LandingAdminsContent />
          </Suspense>
        </div>
      </div>
    </Section>
  );
}
