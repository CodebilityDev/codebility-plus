import H1 from "@/Components/shared/dashboard/H1";

import AdminDashboardApplicantStatusPie from "./_components/AdminDashboardApplicantStatusPie";
import AdminDashboardMonthlyApplicantsLineChart from "./_components/AdminDashboardMonthlyApplicantsLineChart";
import AdminDashboardTotalAccepted from "./_components/AdminDashboardTotalAccepted";
import AdminDashboardTotalApplicants from "./_components/AdminDashboardTotalApplicants";

export default async function AdminDashboard() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Dashboard</H1>
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="flex h-full flex-col gap-4">
            <div className="flex-1 ">
              <AdminDashboardTotalApplicants />
            </div>
            <div className="flex-1">
              <AdminDashboardTotalAccepted />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <AdminDashboardApplicantStatusPie />
        </div>
      </div>
      <div>
        <AdminDashboardMonthlyApplicantsLineChart />
      </div>
    </div>
  );
}
