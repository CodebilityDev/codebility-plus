"use client";

import { useRouter } from "next/navigation";
import CreateJobForm from "./CreateJobForm";
import JobListingsTable from "./JobListingsTable";

export default function HirePageClient() {
  const router = useRouter();

  const handleJobCreated = () => {
    // Refresh the page to get updated stats and job listings
    router.refresh();
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-light text-white">Active Job Listings</h2>
        <CreateJobForm onJobCreated={handleJobCreated} />
      </div>
      <div className="mb-8">
        <JobListingsTable />
      </div>
    </>
  );
}