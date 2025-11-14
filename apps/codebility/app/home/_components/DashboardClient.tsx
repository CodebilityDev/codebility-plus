"use client";

import { useEffect, useState } from "react";
import UserInactiveModal from "@/components/modals/UserInactiveModal";
import { useUserStore } from "@/store/codev-store";

import DashboardCareerOpportunities from "../(dashboard)/_components/DashboardCareerOpportunities";
import DashboardCompleteProfile from "../(dashboard)/_components/DashboardCompleteProfile";
import DashboardCurrentProject from "../(dashboard)/_components/DashboardCurrentProject";
import Profile from "../(dashboard)/_components/DashboardProfile";

import TokenPoints from "../(dashboard)/_components/DashboardTokenPoints";
import WeeklyTop from "../(dashboard)/_components/DashboardWeeklyTop";
import DashboardRoleRoadmap from "../(dashboard)/_components/DashboardRoleRoadmap";

export default function DashboardClient() {
  const { user } = useUserStore();
  const userIsInactive =
    user?.internal_status == "INACTIVE" || user?.availability_status == false;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userIsInactive) {
      setIsModalOpen(true);
    }
  }, [userIsInactive]);

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="md:basis-[50%] xl:basis-[60%]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
              <Profile />
              {/* <TimeTracker /> */}
            </div>
            <DashboardCurrentProject />
            <TokenPoints />
            {/* Role-based Roadmap at the bottom */}
            <DashboardRoleRoadmap />
            {/* <DashboardRoadmap /> Hide Temporarily */}
            {user?.id ? (
              <DashboardCompleteProfile codevId={user.id} />
            ) : (
              <div className="py-4 text-center text-gray-400">
                Loading profile...
              </div>
            )}
          </div>
        </div>
        <div className="md:basis-[50%] xl:basis-[40%]">
          <div className="flex flex-col gap-4">
            <WeeklyTop />
            <DashboardCareerOpportunities />
          </div>
        </div>
      </div>

      {userIsInactive && (
        <UserInactiveModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </>
  );
}
