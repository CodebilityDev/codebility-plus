import React from "react";
import AccountSettingsPage from "@/app/home/account-settings/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ApplicantAccountSettings() {
  return (
    <div className="h-full">
      <AccountSettingsPage />
    </div>
  );
}
