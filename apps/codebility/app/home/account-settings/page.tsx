import { Card, CardContent, CardFooter } from "@codevs/ui/card";
import { Separator } from "@codevs/ui/separator";

import AccountSettings2FA from "./_components/account-settings-2FA";
import AccountSettingsChangePassword from "./_components/account-settings-change-password";
import AccountSettingsDelete from "./_components/account-settings-delete";
import AccountSettingsHeader from "./_components/account-settings-header";

export default function AccountSettingsPage() {
  return (
    <div className="text-dark100_light900 container max-w-[700px] px-4  ">
      <h1 className=" mb-6 text-3xl font-bold">Account Settings</h1>
      <Card className="background-box space-y-8 ">
        <CardContent className="space-y-6">
          <AccountSettingsHeader />
          <Separator />
          <AccountSettingsChangePassword />
          <Separator />
          <AccountSettings2FA />
        </CardContent>
        <CardFooter>
          <AccountSettingsDelete />
        </CardFooter>
      </Card>
    </div>
  );
}
