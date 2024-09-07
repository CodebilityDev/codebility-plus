import React from "react";
import { notificationData } from "~/lib/dummyOrders";

const NotificationCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow md:p-2 lg:p-5">
      <h2 className="lg:text-2xl md:text-xl font-bold mb-2 py-2">
        Notifications
      </h2>
      <ul className="space-y-1">
        {notificationData.map((item, index) => (
          <li
            key={index}
            className="lg:p-3 md:p-1.5 border-b text-base border-gray-200 bg-gray-50"
          >
            {item.notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationCard;
