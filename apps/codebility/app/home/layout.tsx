/* eslint-disable no-unused-vars */
import "server-only";

import React from "react";
import { ModalProviderHome } from "@/Components/providers/modal-provider-home";
import ReactQueryProvider from "@/hooks/reactQuery";
import { getCachedUser } from "@/lib/server/supabase-server-comp";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import LeftSidebar from "./_components/home-left-sidebar";
import Navbar from "./_components/home-navbar";
import ToastNotification from "./_components/home-toast-notification";
import UserContextProvider from "./_components/user-provider";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServerComponentClient();

  const user = await getCachedUser();

  const { data } = await supabase
    .from("profile")
    .select("*, user(*, user_type(*), codev(application_status))")
    .eq("user_id", user?.id!)
    .single();

  const permissionNames = Object.keys(data.user.user_type || {});
  const permissions = permissionNames.filter(
    (permissionName) => data?.user.user_type[permissionName] === true,
  );
  const applicationStatus = data?.user.codev.application_status;

  const {
    user_id,
    first_name,
    last_name,
    pronoun,
    address,
    about,
    education,
    positions,
    main_position,
    portfolio_website,
    tech_stacks,
    image_url,
    start_time,
    end_time,
  } = data || {};

  const userData = {
    id: user_id,
    first_name,
    last_name,
    email: user?.email as string,
    pronoun,
    address,
    about,
    education,
    positions,
    main_position,
    portfolio_website,
    tech_stacks,
    image_url,
    start_time,
    end_time,
    permissions,
    application_status: applicationStatus,
  };

  return (
    <ReactQueryProvider>
      <UserContextProvider userData={userData}>
        <ModalProviderHome />
        {applicationStatus === "ACCEPTED" && <ToastNotification />}
        <main className="background-light850_dark100 relative">
          <Navbar />
          <div className="flex">
            <LeftSidebar />
            <section className="background-lightsection_darksection flex min-h-screen flex-1 flex-col px-4 pb-6 pt-36 max-md:pb-14 md:px-8 lg:px-12">
              <div className="max-w-8xl mx-auto h-full w-full">{children}</div>
            </section>
          </div>
        </main>
      </UserContextProvider>
    </ReactQueryProvider>
  );
}
