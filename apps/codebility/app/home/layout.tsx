/* eslint-disable no-unused-vars */
import "server-only";

import React from "react";
import { redirect } from "next/navigation";
import ReactQueryProvider from "@/hooks/reactQuery";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { getApplicationStatus } from "../(marketing)/codevs/service";
import LeftSidebar from "./_components/home-left-sidebar";
import Navbar from "./_components/home-navbar";
import UserContextProvider from "./_components/user-provider";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: codev } = await getApplicationStatus(user?.id!);

  const { data } = await supabase
    .from("profile")
    .select("*, user(*, user_type(*))")
    .eq("id", user?.id!)
    .single();

  const permissionNames = Object.keys(data.user.user_type || {});
  const permissions = permissionNames.filter(
    (permissionName) => data.user.user_type[permissionName] === true,
  );

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
  } = data;

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
  };

  if (codev?.application_status !== "ACCEPTED") return redirect("/");

  return (
    <ReactQueryProvider>
      <UserContextProvider userData={userData}>
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
