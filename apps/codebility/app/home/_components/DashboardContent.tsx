import { getDashboardData } from "@/lib/server/dashboard-data";

import DashboardCareerOpportunities from "../(dashboard)/_components/DashboardCareerOpportunities";
import DashboardCompleteProfile from "../(dashboard)/_components/DashboardCompleteProfile";
import DashboardCurrentProject from "../(dashboard)/_components/DashboardCurrentProject";
import Profile from "../(dashboard)/_components/DashboardProfile";
import DashboardRoleRoadmap from "../(dashboard)/_components/DashboardRoleRoadmap";
import TokenPoints from "../(dashboard)/_components/DashboardTokenPoints";
import WeeklyTop from "../(dashboard)/_components/DashboardWeeklyTop";
import UserInactiveGate from "./UserInactiveGate";

export default async function DashboardContent() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="py-8 text-center text-gray-400">
        We could not load your dashboard. Try refreshing the page.
      </div>
    );
  }

  const { user } = data;
  const userIsInactive =
    user.internal_status === "INACTIVE" || user.availability_status === false;

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="md:basis-[50%] xl:basis-[60%]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
              <Profile user={user} />
            </div>
            <DashboardCurrentProject projects={data.projects} />
            <TokenPoints
              userId={user.id}
              points={data.pointsByCategory}
              levels={data.levelsByCategory}
              attendancePoints={data.attendancePoints}
              profilePoints={data.profilePoints}
              roleId={user.role_id ?? null}
              promoteDeclined={user.promote_declined ?? null}
            />
            <DashboardRoleRoadmap
              roleId={user.role_id ?? null}
              totalPoints={data.totalPoints}
            />
            <DashboardCompleteProfile completion={data.profileCompletion} />
          </div>
        </div>
        <div className="md:basis-[50%] xl:basis-[40%]">
          <div className="flex flex-col gap-4">
            <WeeklyTop />
            <DashboardCareerOpportunities isCodev={user.role_id === 10} />
          </div>
        </div>
      </div>

      {userIsInactive && <UserInactiveGate />}
    </>
  );
}
