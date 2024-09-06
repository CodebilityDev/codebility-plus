import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { cn } from "@codevs/ui";

import ProfileContextProvider from "~/components/profile-context";
import appConfig from "~/config/app.config";
import { ManageProfileData } from "~/lib/profile-data";
import Card from "~/types/cards";
import BuilderFormProvider from "../_components/builder-form-context";
import { UserWorkspaceContextProvider } from "../../_components/user-workspace-context";
import HomeNavbar from "../../(user)/_components/home-navbar";
import { getBuilderProfileData, getCardById } from "../actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: appConfig.title,
  description: appConfig.description,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
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

  const card = await getCardById(params.id, data.id);
  const builderProfileData = await getBuilderProfileData(card.id);
  return (
    <html lang={appConfig.locale}>
      <body className={cn(inter.className, appConfig.theme)}>
        <UserWorkspaceContextProvider value={data}>
          <div className="fixed -z-10 h-full w-full bg-secondary"></div>
          <HomeNavbar />
          <BuilderFormProvider cardData={card as Card}>
            <ProfileContextProvider
              manageProfileData={builderProfileData as ManageProfileData}
            >
              {children}
            </ProfileContextProvider>
          </BuilderFormProvider>
        </UserWorkspaceContextProvider>
      </body>
    </html>
  );
}
