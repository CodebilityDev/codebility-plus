import { Suspense } from "react";

import H1 from "@/components/global/layout/H1";
import AccountSettings from "@/components/global/account-settings/AccountSettings";
import { AccountSettingsSkeleton } from "@/components/global/account-settings/AccountSettingsSkeleton";

export const instant = false;

export default function ApplicantAccountSettingsPage() {
  return (
    <div className="h-full">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col gap-4 pt-4">
          <H1>Account Settings</H1>
          <span className="text-sm text-gray-400">
            Manage your account credentials and security settings.
          </span>
          <Suspense fallback={<AccountSettingsSkeleton />}>
            <AccountSettings />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
