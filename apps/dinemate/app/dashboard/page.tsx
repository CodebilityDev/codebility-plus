import React from "react";
import StatCard from "~/components/dashboard/dashboard-card/StatCard";
import ChartCard from "~/components/dashboard/dashboard-card/ChartCard";
import GuestsCard from "~/components/dashboard/dashboard-card/GuestsCard";
import NotificationCard from "~/components/dashboard/dashboard-card/NotificationCard";
import RatingCard from "~/components/dashboard/dashboard-card/RatingCard";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex-1 p-6 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="col-span-1 lg:col-span-2 p-4 bg-white rounded-lg shadow">
          <ChartCard />
        </div>
        <div className="col-span-1">
          <GuestsCard />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-1">
          <NotificationCard />
        </div>
        <div className="col-span-1 md:col-span-2">
          <RatingCard />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
