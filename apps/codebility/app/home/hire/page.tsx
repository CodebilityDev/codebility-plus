import { Briefcase, Users, TrendingUp, Clock } from "lucide-react";
import HirePageClient from "./_components/HirePageClient";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { H1 } from "@/components/shared/dashboard";
import PageContainer from "../_components/PageContainer";
import { createClientServerComponent } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HirePage() {
  const supabase = await createClientServerComponent();

  // Fetch real stats from database
  const [activeListingsResult, totalApplicationsResult, newApplicationsResult] = await Promise.all([
    // Count active job listings
    supabase
      .from('job_listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),

    // Count total applications
    supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true }),

    // Count new applications this week
    supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .gte('applied_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  ]);

  // Calculate average time to hire (for hired applications)
  const { data: hiredApplications } = await supabase
    .from('job_applications')
    .select('applied_at, reviewed_at')
    .eq('status', 'hired')
    .not('reviewed_at', 'is', null);

  let avgTimeToHire = "N/A";
  if (hiredApplications && hiredApplications.length > 0) {
    const totalDays = hiredApplications.reduce((sum, app) => {
      const applied = new Date(app.applied_at);
      const reviewed = new Date(app.reviewed_at);
      const days = Math.floor((reviewed.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    const avgDays = Math.round(totalDays / hiredApplications.length);
    avgTimeToHire = `${avgDays} days`;
  }

  const stats = {
    activeListings: activeListingsResult.count || 0,
    totalApplications: totalApplicationsResult.count || 0,
    newThisWeek: newApplicationsResult.count || 0,
    avgTimeToHire,
  };

  const breadcrumbItems = [
    { label: "Management", href: "/home" },
    { label: "Hire" },
  ];

  return (
    <PageContainer>
      <div className="mb-6">
        <CustomBreadcrumb items={breadcrumbItems} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <H1>Job Management</H1>
        <p className="mt-2 text-muted-foreground">
          Create and manage job listings, review applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card  dark:border-gray-800 dark:bg-gray-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Active Listings</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {stats.activeListings}
              </p>
            </div>
            <div className="rounded-full bg-customViolet-100/10 p-3">
              <Briefcase className="h-6 w-6 text-customViolet-100" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card dark:border-gray-800 dark:bg-gray-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Total Applications</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {stats.totalApplications}
              </p>
            </div>
            <div className="rounded-full bg-customBlue-100/10 p-3">
              <Users className="h-6 w-6 text-customBlue-100" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card dark:border-gray-800 dark:bg-gray-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">New This Week</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {stats.newThisWeek}
              </p>
            </div>
            <div className="rounded-full bg-customTeal/10 p-3">
              <TrendingUp className="h-6 w-6 text-customTeal" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card dark:border-gray-800 dark:bg-gray-900/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Avg. Time to Hire</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {stats.avgTimeToHire}
              </p>
            </div>
            <div className="rounded-full bg-green-500/10 p-3">
              <Clock className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Client Components */}
      <HirePageClient />
    </PageContainer>
  );
}