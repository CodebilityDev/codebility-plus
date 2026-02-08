"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientClientComponent } from "@/utils/supabase/client";
import { H1 } from "@/components/shared/dashboard";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";

import { Card, CardContent, CardFooter } from "@codevs/ui/card";
import { Separator } from "@codevs/ui/separator";

import AccountSettings2FA from "./_components/AccountSettings2FA";
import AccountSettingsChangePassword from "./_components/AccountSettingsChangePassword";
import AccountSettingsDelete from "./_components/AccountSettingsDelete";
import AccountSettingsHeader from "./_components/AccountSettingsHeader";
import AccountSettingsUsername from "./_components/AccountSettingsUsername";

export const dynamic = "force-dynamic";

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Account Settings" },
];

interface User {
  id: string;
  email?: string;
}

export default function AccountSettingsPage({ showBreadcrumb = true }: { showBreadcrumb?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  // Initialize Supabase client safely on the client side
  /* useEffect(() => {
    try {
      const client = createClientClientComponent();
      setSupabase(client);
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error);
      router.push("/auth/login");
    }
  }, [router]); */

  useEffect(() => {
    if (!supabase) return;

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
  }, [router, supabase]);

  const LoadingContent = () => (
    <div className="grid gap-6 lg:grid-cols-2 max-w-none">
      <Card className="background-box text-dark100_light900 self-start">
        <CardContent className="space-y-4 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-3 w-56 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="h-9 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="background-box text-dark100_light900 border border-red-600 self-start">
        <CardContent className="space-y-4 p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-9 w-32 rounded bg-red-200 dark:bg-red-800"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="mx-auto max-w-screen-xl">
      {showBreadcrumb && (
        <CustomBreadcrumb items={items} />
      )}

      <div className="flex flex-col gap-4 pt-4">
        <H1>Account Settings</H1>
        <span className="text-sm text-gray-400">
          Manage your account credentials and security settings.
        </span>
        
        {loading ? (
          <LoadingContent />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 p-2">
            <Card className="background-box text-dark100_light900 h-fit">
              <CardContent className="space-y-4 ">
                <AccountSettingsHeader email={user.email || "No email available"} />
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
        )}
      </div>
    </div>
  );
}
