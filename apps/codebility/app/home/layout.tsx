/* eslint-disable no-unused-vars */
import "server-only"
import LeftSidebar from "./_components/home-left-sidebar"
import Navbar from "./_components/home-navbar"
import React from "react"
import ReactQueryProvider from "@/hooks/reactQuery"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
// import UserContextProvider from "./_components/user-provider"

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient( { cookies } );

  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase.from("user")
  .select(`
    *,
    user_type(
      roles,
      kanban,
      clients,
      interns,
      my_task,
      in_house,
      projects,
      services,
      dashboard,
      applicants,
      org_charts,
      permissions,
      time_tracker
    ),
    profile(*)
  `).eq('id', user?.id)
  .single();

  const permissionNames = Object.keys(data?.user_type || {});
  const permissions = permissionNames.filter(permissionName => data.user_type[permissionName]);
  // const { first_name, last_name, main_position, image_url } = data.profile;

  // const userData = {
  //   first_name,
  //   last_name,
  //   email: data.email,
  //   main_position,
  //   image_url,
  //   permissions
  // };

  return (
    <ReactQueryProvider>
      {/* <UserContextProvider userData={userData}>    */}
        <main className="background-light850_dark100 relative">
          <Navbar />
          <div className="flex">
            <LeftSidebar />
            <section className="background-lightsection_darksection flex min-h-screen flex-1 flex-col px-4 pb-6 pt-36 max-md:pb-14 md:px-8 lg:px-12">
              <div className="max-w-8xl mx-auto h-full w-full">{children}</div>
            </section>
          </div>
        </main>
      {/* </UserContextProvider> */}
    </ReactQueryProvider>
  )
}
