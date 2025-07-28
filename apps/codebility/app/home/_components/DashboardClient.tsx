"use client";

import { useEffect, useState } from "react";
import UserInactiveModal from "@/components/modals/UserInactiveModal";
import { useUserStore } from "@/store/codev-store";
import DashboardCurrentProject from "../(dashboard)/_components/DashboardCurrentProject";
import Profile from "../(dashboard)/_components/DashboardProfile";
import TokenPoints from "../(dashboard)/_components/DashboardTokenPoints";
import WeeklyTop from "../(dashboard)/_components/DashboardWeeklyTop";

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
            {/* <DashboardRoadmap /> Hide Temporarily */}
          </div>
        </div>
        <div className="md:basis-[50%] xl:basis-[40%]">
          <WeeklyTop />
        </div>
      </div>
      {userIsInactive && (
        <UserInactiveModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </>
  );
}