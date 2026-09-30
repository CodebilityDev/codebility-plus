import MarketingProgressiveSection from "@/components/global/marketing/MarketingProgressiveSection";
import ProgressiveMotion from "@/components/global/marketing/ProgressiveMotion";
import { JobListingsBody } from "@/components/marketing/careers/JobListingsBody";
import type { JobListingsShellProps } from "@/types/marketing/careers/careers";




export default function JobListingsShell({
  initialData,
  pageSize,
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
              <JobListingsBody initialData={initialData} pageSize={pageSize} />
            </div>
          </ProgressiveMotion>
        </MarketingProgressiveSection>
      </div>
    </section>
  );
}