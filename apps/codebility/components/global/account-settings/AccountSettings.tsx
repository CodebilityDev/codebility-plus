import { Suspense } from "react";

import H1 from "@/components/global/layout/H1";
import { AccountSettingsContent } from "@/components/global/account-settings/AccountSettingsContent";
import { LoadingContent } from "@/components/global/account-settings/LoadingContent";












export default function AccountSettings() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <H1>Account Settings</H1>
        <span className="text-sm text-gray-400">
          Manage your account credentials and security settings.
        </span>

        <Suspense fallback={<LoadingContent />}>
          <AccountSettingsContent />
        </Suspense>
      </div>
    </div>
  );
}
