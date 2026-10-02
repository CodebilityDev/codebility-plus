import { Suspense } from "react";

import MarketingProgressiveSection from "@/components/global/marketing/MarketingProgressiveSection";
import ProgressiveMotion from "@/components/global/marketing/ProgressiveMotion";
import { JobListingsFallback } from "@/components/marketing/careers/JobListingsFallback";
import JobListingsSection from "@/components/marketing/careers/JobListingsSection";
import { getCachedCareersJobDepartments } from "@/lib/global/careers-job-listings-cached";
import type { JobListingsBlockProps } from "@/types/marketing/careers/careers";

export async function JobListingsBlock({ searchParams }: JobListingsBlockProps) {
  // The department list does not depend on the URL, so it is cached and lands in
  // the static shell. Only the listings wait on the per-page fetch.
  const departments = (await getCachedCareersJobDepartments()) ?? [];

  const headingSkeleton = (
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
        Open Positions
      </h2>
      <p className="text-lg text-gray-400">
        Join our team and help shape the future of technology
      </p>
    </div>
  );

  return (
    <section id="open-positions" className="relative border-y border-gray-800 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Only the heading sits behind the progressive reveal. Its content is
            visibility:hidden until hydration, so the filter and the listing
            skeleton stay outside it and paint straight from the static shell. */}
        <MarketingProgressiveSection skeleton={headingSkeleton}>
          <ProgressiveMotion y={30} duration={0.6} staggerChildren={0.1}>
            <div data-progressive-child className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
                Open Positions
              </h2>
              <p className="text-lg text-gray-400">
                Join our team and help shape the future of technology
              </p>
            </div>
          </ProgressiveMotion>
        </MarketingProgressiveSection>

        <Suspense fallback={<JobListingsFallback departments={departments} />}>
          <JobListingsSection searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
