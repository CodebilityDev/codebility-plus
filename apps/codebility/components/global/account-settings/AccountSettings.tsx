import { connection } from "next/server";

import H1 from "@/components/global/layout/H1";
import { AccountSettingsContent } from "@/components/global/account-settings/AccountSettingsContent";
import { getCurrentCodev } from "@/lib/global/current-codev";
import { getMfaFactors } from "@/lib/global/mfa-factors";

export default async function AccountSettings() {
  await connection();

  const [user, mfaFactors] = await Promise.all([
    getCurrentCodev(),
    getMfaFactors(),
  ]);

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <H1>Account Settings</H1>
        <span className="text-sm text-gray-400">
          Manage your account credentials and security settings.
        </span>

        <AccountSettingsContent user={user} mfaFactors={mfaFactors} />
      </div>
    </div>
  );
}
