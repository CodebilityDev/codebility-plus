import { Suspense } from "react";


import Section from "@/components/global/marketing/MarketingSection";

import { LandingAdminsSkeleton } from "@/components/marketing/LandingAdminsSkeleton";
import { LandingAdminsContent } from "@/components/marketing/LandingAdminsContent";



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
