import { JobListingsSkeleton } from "@/components/marketing/careers/JobListingsSkeleton";
import { PAGE_SIZE } from "@/constants/marketing/careers/careers";

export function JobListingsFallback() {
  return (
    <section id="open-positions" className="relative border-y border-gray-800 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <JobListingsSkeleton count={PAGE_SIZE} />
      </div>
    </section>
  );
}
