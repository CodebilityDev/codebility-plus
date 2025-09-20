import H1 from "@/components/shared/dashboard/H1";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import { createClientServerComponent } from "@/utils/supabase/server";
import PageContainer from "../_components/PageContainer";

import AdminDashboardApplicantStatusPie from "./_components/AdminDashboardApplicantStatusPie";
import AdminDashboardMonthlyApplicantsLineChart from "./_components/AdminDashboardMonthlyApplicantsLineChart";
import AdminDashboardProjectsPie from "./_components/AdminDashboardProjectsPie";
import AdminDashboardTotalActiveIntern from "./_components/AdminDashboardTotalActiveIntern";
import AdminDashboardTotalAdmin from "./_components/AdminDashboardTotalAdmin";
import AdminDashboardTotalCodev from "./_components/AdminDashboardTotalCodev";
import AdminDashboardTotalInactiveIntern from "./_components/AdminDashboardTotalInactiveIntern";
import AdminDashboardTotalMentor from "./_components/AdminDashboardTotalMentor";
import AdminDashboardTotalProjects from "./_components/AdminDashboardTotalProject";

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

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("project_category_id");

  const { data: categories, error: categoriesError } = await supabase
    .from("projects_category")
    .select("id, name");

  // Handle errors early
  if (codevError) {
    console.error("Failed to fetch codevs:", codevError.message);
    return;
  }
  if (projectsError) {
    console.error("Failed to fetch projects:", projectsError.message);
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
  if (!projects) {
    console.warn("No projects data found.");
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

  //Projects
  const projectCounts = categories.reduce(
    (acc, category) => {
      const count = projects.filter(
        (p) => p.project_category_id === category.id,
      ).length;
      acc[category.name] = count;
      return acc;
    },
    {} as Record<string, number>,
  );

  const projectTotalCount = projects.length;

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
    <PageContainer maxWidth="2xl">
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <AdminDashboardTotalActiveIntern
            count={dashboardData?.activeInterns}
          />
          <AdminDashboardTotalInactiveIntern
            count={dashboardData?.inactiveInterns}
          />
          <AdminDashboardTotalCodev count={dashboardData?.codevs} />
          <AdminDashboardTotalAdmin count={dashboardData?.admins} />
          <AdminDashboardTotalMentor count={dashboardData?.mentors} />
          <AdminDashboardTotalProjects
            count={dashboardData?.projectTotalCount}
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
    </PageContainer>
  );
}
