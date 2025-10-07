import React from "react";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";

import AccountSettingsPage from "../../account-settings/page";

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Account Settings" },
];

export default function SettingsAccount() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="pb-4 pt-12">
        <CustomBreadcrumb items={items} />
      </div>

      <AccountSettingsPage showBreadcrumb={false} />
    </div>
  );
}
