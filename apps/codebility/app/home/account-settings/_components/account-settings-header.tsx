import React from "react";
import { Lock } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "@codevs/ui/card";
import { Input } from "@codevs/ui/input";

import AccountSettingsDialog from "./account-settings-dialog";

export default function AccountSettingsHeader() {
  return (
    <>
      <CardHeader className="px-0 sm:p-6">
        <CardTitle className="flex items-center text-sm sm:text-2xl">
          <Lock className="mr-2" /> Account Security
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Manage your account credentials and security settings.
        </CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Input
          readOnly
          label="Email Address"
          parentClassName="flex justify-center flex-col gap-2 w-full"
        />
        <AccountSettingsDialog />
      </div>
    </>
  );
}
