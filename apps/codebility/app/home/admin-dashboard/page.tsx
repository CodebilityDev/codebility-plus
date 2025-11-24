import H1 from "@/components/shared/dashboard/H1";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import { createClientServerComponent } from "@/utils/supabase/server";

import AdminDashboardApplicantStatusPie from "./_components/AdminDashboardApplicantStatusPie";
import AdminDashboardMonthlyApplicantsLineChart from "./_components/AdminDashboardMonthlyApplicantsLineChart";
import AdminDashboardProjectsPie from "./_components/AdminDashboardProjectsPie";
import AdminDashboardStatsCard from "./_components/AdminDashboardStatsCard";

// Force dynamic rendering to avoid prerender errors with Supabase env vars
export const dynamic = "force-dynamic";
// Use ISR with 60 second revalidation for dashboard stats
export const revalidate = 60;

async function getDashboardData() {
  const supabase = await createClientServerComponent();
  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select(
      "internal_status, availability_status, role_id, application_status, date_applied",
    );

  // Fetch project categories junction table to count projects per category
  const { data: projectCategories, error: projectCategoriesError } = await supabase
    .from("project_categories")
    .select("project_id, category_id");

  const { data: categories, error: categoriesError } = await supabase
    .from("projects_category")
    .select("id, name");

  // Handle errors early
  if (codevError) {
    console.error("Failed to fetch codevs:", codevError.message);
    return;
  }
  if (projectCategoriesError) {
    console.error("Failed to fetch project categories:", projectCategoriesError.message);
    return;
  }
  if (categoriesError) {
    console.error("Failed to fetch categories:", categoriesError.message);
    return;
  }

  // Handle null data
  if (!codev) {
    console.warn("No codevs data found.");
    return;
  }
  if (!projectCategories) {
    console.warn("No project categories data found.");
    return;
  }
  if (!categories) {
    console.warn("No categories data found.");
    return;
  }

  //Applicants
  const applicantStatuses = ["applying", "testing", "onboarding", "passed"];

  const applicantStatusCounts = applicantStatuses.reduce(
    (acc, status) => {
      acc[status] = codev.filter((c) => c.application_status === status).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const dateApplied = codev.map((c) => c.date_applied);

  //Interns
  const activeInterns = codev.filter(
    (c) =>
      (c.internal_status !== "INACTIVE" || c.availability_status) &&
      c.role_id === 4,
  ).length;
  const inactiveInterns = codev.filter(
    (c) =>
      (c.internal_status === "INACTIVE" || !c.availability_status) &&
      c.role_id === 4,
  ).length;

  //Codevs
  const codevs = codev.filter((c) => c.role_id === 10).length;

  //Mentors
  const mentors = codev.filter((c) => c.role_id === 5).length;

  //Admins
  const admins = codev.filter((c) => c.role_id === 1).length;

  //Projects - Count unique projects per category (many-to-many relationship)
  const projectCounts = categories.reduce(
    (acc, category) => {
      // Count unique project_ids that have this category
      const count = projectCategories.filter(
        (pc) => pc.category_id === category.id,
      ).length;
      acc[category.name] = count;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Count total unique projects
  const uniqueProjectIds = new Set(projectCategories.map((pc) => pc.project_id));
  const projectTotalCount = uniqueProjectIds.size;

  return {
    applicantStatusCounts,
    dateApplied,
    activeInterns,
    inactiveInterns,
    codevs,
    mentors,
    admins,
    projectCounts,
    projectTotalCount,
  };
}

export default async function AdminDashboard() {
  const dashboardData = await getOrSetCache(cacheKeys.dashboard.admin, () =>
    getDashboardData(),
  );

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <H1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                  Dashboard
                </H1>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor your platform metrics and analytics
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Grid - UPDATED TO USE SHARED COMPONENT */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <AdminDashboardStatsCard
              title="Total Active Interns"
              count={dashboardData?.activeInterns}
              description="Currently active interns"
              iconName="UserCheck"
              colorTheme="blue"
            />
            
            <AdminDashboardStatsCard
              title="Total Inactive Interns"
              count={dashboardData?.inactiveInterns}
              description="Currently inactive interns"
              iconName="UserX"
              colorTheme="red"
            />
            
            <AdminDashboardStatsCard
              title="Total Codevs"
              count={dashboardData?.codevs}
              description="Registered developers"
              iconName="Users"
              colorTheme="green"
            />
            
            <AdminDashboardStatsCard
              title="Total Admins"
              count={dashboardData?.admins}
              description="System administrators"
              iconName="UserCog"
              colorTheme="purple"
            />
            
            <AdminDashboardStatsCard
              title="Total Mentors"
              count={dashboardData?.mentors}
              description="Active mentors"
              iconName="UserPen"
              colorTheme="orange"
            />
            
            <AdminDashboardStatsCard
              title="Total Projects"
              count={dashboardData?.projectTotalCount}
              description="Active projects"
              iconName="FolderKanban"
              colorTheme="cyan"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminDashboardApplicantStatusPie
              data={dashboardData?.applicantStatusCounts}
            />
            <AdminDashboardProjectsPie data={dashboardData?.projectCounts} />
          </div>

          {/* Line Chart */}
          <div className="w-full">
            <AdminDashboardMonthlyApplicantsLineChart
              dateApplied={dashboardData?.dateApplied}
            />
          </div>
        </div>
      </div>
    </div>
  );
}