import AsyncErrorBoundary from "@/components/global/feedback/AsyncErrorBoundary";

import NewApplicantFetchComp from "@/components/home/applicants/applicantFetchComp";

export default function NewApplicants() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <AsyncErrorBoundary
          fallback={
            <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 text-4xl">📋</div>
              <h2 className="mb-2 text-xl font-semibold">Failed to load applicants</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We couldn't load the applicants data. Please try refreshing the page.
              </p>
            </div>
          }
        >
            <NewApplicantFetchComp />

        </AsyncErrorBoundary>
      </div>
    </div>
  );
}
