import "server-only";

import React from "react";
import { ModalProviderHome } from "@/Components/providers/modal-provider-home";
import ReactQueryProvider from "@/hooks/reactQuery";

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

  // Fetch authenticated user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

  // Fetch user data from codev table
  const { data: codevData, error: codevError } = await supabase
    .from("codev")
    .select(
      `
      id,
      first_name,
      last_name,
      address,
      about,
      positions,
      display_position,
      portfolio_website,
      tech_stacks,
      image_url,
      application_status,
      role_id,
      education(
        id,
        codev_id,
        institution,
        degree,
        start_date,
        end_date,
        description
      )
    `,
    )
    .eq("id", userId)
    .single();

  if (codevError || !codevData) {
    throw new Error("Failed to fetch user data");
  }

  // Fetch role permissions using role_id
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select(
      `
      id,
      name,
      dashboard,
      kanban,
      time_tracker,
      interns,
      applicants,
      inhouse,
      clients,
      projects,
      roles,
      permissions,
      services,
      resume,
      settings,
      orgchart
    `,
    )
    .eq("id", codevData.role_id)
    .single();

  if (roleError || !roleData) {
    throw new Error("Failed to fetch role data");
  }

  // Extract permissions and application status
  const { application_status, ...userDetails } = codevData;
  const permissions = Object.keys(roleData).filter(
    (key) => roleData[key] === true,
  );

  // Build user context data
  const userData = {
    ...userDetails,
    email: session.user.email,
    permissions,
    role_name: roleData.name,
    application_status,
    education: codevData.education || [],
  };

  return (
    <ReactQueryProvider>
      <UserContextProvider userData={userData}>
        <ModalProviderHome />
        {application_status === "passed" && <ToastNotification />}
        <main className="background-light850_dark100 relative">
          <Navbar />
          <div className="flex">
            <LeftSidebar />
            <section className="background-lightsection_darksection flex min-h-screen flex-1 flex-col px-4 pb-6 pt-28 max-md:pb-14 md:px-8 lg:px-12">
              <div className="max-w-8xl mx-auto h-full w-full">{children}</div>
            </section>
          </div>
        </main>
      </UserContextProvider>
    </ReactQueryProvider>
  );
}
