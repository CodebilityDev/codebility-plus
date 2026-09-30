"use client";

import AccountSettings2FA from "@/components/global/account-settings/AccountSettings2FA";
import AccountSettingsChangePassword from "@/components/global/account-settings/AccountSettingsChangePassword";
import AccountSettingsDelete from "@/components/global/account-settings/AccountSettingsDelete";
import AccountSettingsHeader from "@/components/global/account-settings/AccountSettingsHeader";
import AccountSettingsUsername from "@/components/global/account-settings/AccountSettingsUsername";
import { LoadingContent } from "@/components/global/account-settings/LoadingContent";
import { useCurrentUser } from "@/hooks/global/use-current-user";
import { Card, CardContent } from "@codevs/ui/card";
import { Separator } from "@codevs/ui/separator";

export function AccountSettingsContent() {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) return <LoadingContent />;
  if (!user) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-2 p-2">
      <Card className="background-box text-dark100_light900 h-fit">
        <CardContent className="space-y-4 ">
          <AccountSettingsHeader email={user.email_address} />
          <Separator />
          <AccountSettingsChangePassword />
          <Separator />
          <AccountSettings2FA />
        </CardContent>
      </Card>

      <div className="w-full h-fit space-y-2">
        <AccountSettingsDelete />

        <Card className="background-box text-foreground h-fit">
          <CardContent className="p-6">
            <AccountSettingsUsername userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
