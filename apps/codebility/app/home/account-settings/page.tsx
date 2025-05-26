"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientClientComponent } from "@/utils/supabase/client";

import { Card, CardContent, CardFooter } from "@codevs/ui/card";
import { Separator } from "@codevs/ui/separator";

import AccountSettings2FA from "./_components/AccountSettings2FA";
import AccountSettingsChangePassword from "./_components/AccountSettingsChangePassword";
import AccountSettingsDelete from "./_components/AccountSettingsDelete";
import AccountSettingsHeader from "./_components/AccountSettingsHeader";

interface User {
  id: string;
  email?: string;
}

export default function AccountSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser();

        if (error || !authUser) {
          router.push("/auth/login");
          return;
        }

        setUser({
          id: authUser.id,
          email: authUser.email,
        });
      } catch (error) {
        console.error("Error getting user:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [router, supabase.auth]);

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-xl">
        <h1 className="text-dark100_light900 mb-6 text-3xl font-bold">
          Account Settings
        </h1>
        <Card className="bg-light-900 dark:bg-dark-100 space-y-8">
          <CardContent className="space-y-6 p-4">
            <div className="animate-pulse">
              <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="mx-auto max-w-screen-xl">
      <h1 className="text-dark100_light900 mb-6 text-3xl font-bold">
        Account Settings
      </h1>
      <Card className="bg-light-900 dark:bg-dark-100 space-y-8">
        <CardContent className="space-y-6 p-4">
          <AccountSettingsHeader email={user.email || "No email available"} />
          <Separator />
          <AccountSettingsChangePassword />
          <Separator />
          <AccountSettings2FA />
        </CardContent>
        <CardFooter className="px-3">
          <AccountSettingsDelete />
        </CardFooter>
      </Card>
    </div>
  );
}
