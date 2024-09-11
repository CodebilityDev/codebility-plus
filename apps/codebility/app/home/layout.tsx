/* eslint-disable no-unused-vars */
import "server-only";



import React from "react";
import ReactQueryProvider from "@/hooks/reactQuery";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { permissionsString } from "../../constants";
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

  let userData = {
    id: "",
    codev_id: "",
    first_name: "",
    last_name: "",
    email: "",
    main_position: "",
    start_time: 0,
    end_time: 0,
    image_url: "",
    permissions: [""],
  };

  const { data } = await supabase
    .from("user")
    .select(
      `
    *,
    codev(
      id,
      start_time,
      end_time
    ),
    user_type(${permissionsString}),
    profile(*)
  `,
    )
    .eq("id", user?.id)
    .single();

  if (data) {
    const permissionNames = Object.keys(data?.user_type || {});
    const permissions = permissionNames.filter(
      (permissionName) => data.user_type[permissionName],
    );
    const { first_name, last_name, main_position, image_url } = data.profile;
    const { start_time, end_time } = data.codev;

    userData = {
      id: data.id,
      codev_id: data.codev.id,
      first_name,
      last_name,
      email: data.email,
      main_position,
      start_time,
      end_time,
      image_url,
      permissions,
    };
  }

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
