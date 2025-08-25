import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";
import CreateJobForm from "./_components/CreateJobForm";
import JobListingsTable from "./_components/JobListingsTable";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { H1 } from "@/components/shared/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HirePage() {
  // Mock stats - replace with actual data
  const stats = {
    activeListings: 8,
    totalApplications: 47,
    newThisWeek: 12,
    avgTimeToHire: "14 days",
  };

  const breadcrumbItems = [
    { label: "Management", href: "/home" },
    { label: "Hire" },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H1>Job Management</H1>
          <p className="mt-2 text-gray-400">
            Create and manage job listings, review applications
          </p>
        </div>
        <CreateJobForm />
      </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Listings</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {stats.activeListings}
                </p>
              </div>
              <div className="rounded-full bg-customViolet-100/10 p-3">
                <Briefcase className="h-6 w-6 text-customViolet-100" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Applications</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {stats.totalApplications}
                </p>
              </div>
              <div className="rounded-full bg-customBlue-100/10 p-3">
                <Users className="h-6 w-6 text-customBlue-100" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">New This Week</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {stats.newThisWeek}
                </p>
              </div>
              <div className="rounded-full bg-customTeal/10 p-3">
                <TrendingUp className="h-6 w-6 text-customTeal" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg. Time to Hire</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {stats.avgTimeToHire}
                </p>
              </div>
              <div className="rounded-full bg-green-500/10 p-3">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
        </div>

      {/* Job Listings Table */}
      <div>
        <h2 className="mb-4 text-xl font-light text-white">Active Job Listings</h2>
        <JobListingsTable />
      </div>
    </div>
  );
}