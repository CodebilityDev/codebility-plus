import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import { cn } from "@codevs/ui/utils";

import { signOut } from "~/app/auth/actions";
import appConfig from "~/config/app.config";
import { UserWorkspaceContextProvider } from "../_components/user-workspace-context";
import HomeNavbar from "./_components/home-navbar";
import HomeSidebar from "./_components/home-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = getSupabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", user?.id)
    .single();

  if (!user || !data) await signOut();

  return (
    <html lang={appConfig.locale}>
      <body className={cn(inter.className, appConfig.theme)}>
        <UserWorkspaceContextProvider value={data}>
          <div className="flex gap-0">
            <div className="relative h-screen w-1/5">
              <HomeSidebar />
            </div>
            <div className="h-screen flex-1 overflow-scroll bg-secondary">
              <HomeNavbar />
              {children}
            </div>
          </div>
        </UserWorkspaceContextProvider>
      </body>
    </html>
  );
}
