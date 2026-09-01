"use client";

import type { CareersJobListingsInitial } from "@/types/marketing/careers-job-listings";

import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../_shared/ProgressiveMotion";
import JobListingsPagination from "./JobListingsPagination";
import { JobListingsSkeleton } from "./JobListingsSkeleton";

type JobListingsShellProps = {
  pageSize: number;
  initialData?: CareersJobListingsInitial | null;
  loading?: boolean;
};

function JobListingsBody({
  initialData,
  pageSize,
  loading,
}: JobListingsShellProps) {
  if (loading) {
    return <JobListingsSkeleton count={pageSize} />;
  }

  if (!initialData) {
    return (
      <p className="py-12 text-center text-red-400">
        Failed to load job listings. Please try again later.
      </p>
    );
  }

  if (initialData.jobs.length === 0 && initialData.pagination.total === 0) {
    return (
      <p className="py-12 text-center text-gray-400">
        No open positions at the moment. Please check back later.
      </p>
    );
  }

  return (
    <JobListingsPagination initialData={initialData} pageSize={pageSize} />
  );
}

export default function JobListingsShell({
  initialData = null,
  pageSize,
  loading = false,
}: JobListingsShellProps) {
  const skeleton = (
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
        <MarketingProgressiveSection skeleton={skeleton}>
          <ProgressiveMotion y={30} duration={0.6} staggerChildren={0.1}>
            <div data-progressive-child className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-light tracking-tight text-white">
                Open Positions
              </h2>
              <p className="text-lg text-gray-400">
                Join our team and help shape the future of technology
              </p>
            </div>

            <div data-progressive-child>
              <JobListingsBody
                initialData={initialData}
                pageSize={pageSize}
                loading={loading}
              />
            </div>
          </ProgressiveMotion>
        </MarketingProgressiveSection>
      </div>
    </section>
  );
}
