import { AccountSettingsSkeleton } from "@/components/global/account-settings/AccountSettingsSkeleton";
import H1 from "@/components/global/layout/H1";

export default function AccountSettingsLoading() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <H1>Account Settings</H1>
        <AccountSettingsSkeleton />
      </div>
    </div>
  );
}
