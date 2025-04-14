import { getCachedUser } from "@/lib/server/supabase-server-comp";

import { Card, CardContent, CardFooter } from "@codevs/ui/card";
import { Separator } from "@codevs/ui/separator";

import AccountSettings2FA from "./_components/AccountSettings2FA";
import AccountSettingsChangePassword from "./_components/AccountSettingsChangePassword";
import AccountSettingsDelete from "./_components/AccountSettingsDelete";
import AccountSettingsHeader from "./_components/AccountSettingsHeader";

export default async function AccountSettingsPage() {
  const user = await getCachedUser();

  return (
    <div className="mx-auto max-w-screen-xl">
      <h1 className="text-dark100_light900 mb-6 text-3xl font-bold">
        Account Settings
      </h1>
      <Card className="bg-light-900 dark:bg-dark-100 space-y-8 ">
        <CardContent className="space-y-6 p-4">
          {/* <AccountSettingsHeader email={user?.email as string} />
          <Separator /> */}
          <AccountSettingsChangePassword />
          <Separator />
         {/*  <AccountSettings2FA /> */}
        </CardContent>
        <CardFooter className="px-3">
          <AccountSettingsDelete />
        </CardFooter>
      </Card>
    </div>
  );
}
