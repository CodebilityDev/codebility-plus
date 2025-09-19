import H1 from "@/components/shared/dashboard/H1";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import { createClientServerComponent } from "@/utils/supabase/server";

import AdminDashboardApplicantStatusPie from "./_components/AdminDashboardApplicantStatusPie";
import AdminDashboardMonthlyApplicantsLineChart from "./_components/AdminDashboardMonthlyApplicantsLineChart";
import AdminDashboardProjectsPie from "./_components/AdminDashboardProjectsPie";
import AdminDashboardTotalActiveIntern from "./_components/AdminDashboardTotalActiveIntern";
import AdminDashboardTotalAdmin from "./_components/AdminDashboardTotalAdmin";
import AdminDashboardTotalCodev from "./_components/AdminDashboardTotalCodev";
import AdminDashboardTotalInactiveIntern from "./_components/AdminDashboardTotalInactiveIntern";
import AdminDashboardTotalMentor from "./_components/AdminDashboardTotalMentor";
import AdminDashboardTotalProjects from "./_components/AdminDashboardTotalProject";

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
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 pt-6">
      <H1>Dashboard</H1>
      {/* <p>{JSON.stringify(dashboardData, null, 2)}</p> */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <AdminDashboardTotalActiveIntern
            count={dashboardData?.activeInterns}
          />
        </div>
        <div className="flex-1">
          <AdminDashboardTotalInactiveIntern
            count={dashboardData?.inactiveInterns}
          />
        </div>
        <div className="flex-1">
          <AdminDashboardTotalCodev count={dashboardData?.codevs} />
        </div>
        <div className="flex-1">
          <AdminDashboardTotalAdmin count={dashboardData?.admins} />
        </div>
        <div className="flex-1">
          <AdminDashboardTotalMentor count={dashboardData?.mentors} />
        </div>
        <div className="flex-1">
          <AdminDashboardTotalProjects
            count={dashboardData?.projectTotalCount}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <AdminDashboardApplicantStatusPie
            data={dashboardData?.applicantStatusCounts}
          />
        </div>
        <div className="flex-1">
          <AdminDashboardProjectsPie data={dashboardData?.projectCounts} />
        </div>
      </div>
      <div>
        <AdminDashboardMonthlyApplicantsLineChart
          dateApplied={dashboardData?.dateApplied}
        />
      </div>
    </div>
  );
}
