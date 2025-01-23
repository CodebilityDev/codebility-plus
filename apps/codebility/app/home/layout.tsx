"use client";

import React from "react";
import { ModalProviderHome } from "@/Components/providers/modal-provider-home";
import ReactQueryProvider from "@/hooks/reactQuery";
import { Codev } from "@/types/home/codev";

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
      created_at,
      updated_at,
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

  // Fetch role details using role_id
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select(
      `
      id,
      name
    `,
    )
    .eq("id", codevData.role_id)
    .single();

  if (roleError || !roleData) {
    throw new Error("Failed to fetch role data");
  }

  // Build user context data to match `Codev` type
  const userData: Codev = {
    id: codevData.id,
    first_name: codevData.first_name,
    last_name: codevData.last_name,
    email_address: session.user.email!,
    phone_number: "",
    address: codevData.address || null,
    about: codevData.about || null,
    education: codevData.education || [],
    positions: codevData.positions || [],
    display_position: codevData.display_position,
    portfolio_website: codevData.portfolio_website,
    tech_stacks: codevData.tech_stacks || [],
    image_url: codevData.image_url || null,
    availability_status: true,
    job_status: null,
    nda_status: false,
    level: {},
    application_status: codevData.application_status,
    rejected_count: 0,
    facebook_link: "",
    linkedin: "",
    github: "",
    discord: "",
    projects: [],
    years_of_experience: 0,
    role_id: codevData.role_id,
    internal_status: "AVAILABLE",
    created_at: codevData.created_at,
    updated_at: codevData.updated_at,
  };

  return (
    <ReactQueryProvider>
      <UserContextProvider userData={userData}>
        <ModalProviderHome />
        {userData.application_status === "passed" && <ToastNotification />}
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
