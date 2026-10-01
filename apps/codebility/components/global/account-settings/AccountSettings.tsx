import { connection } from "next/server";

import { AccountSettingsContent } from "@/components/global/account-settings/AccountSettingsContent";
import { getCurrentCodev } from "@/lib/global/current-codev";
import { getMfaFactors } from "@/lib/global/mfa-factors";

export default async function AccountSettings() {
  await connection();

  const [user, mfaFactors] = await Promise.all([
    getCurrentCodev(),
    getMfaFactors(),
  ]);

  return <AccountSettingsContent user={user} mfaFactors={mfaFactors} />;
}
