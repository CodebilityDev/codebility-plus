import { Suspense } from "react";
import { H1 } from "@/components/shared/dashboard";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { createClientServerComponent } from "@/utils/supabase/server";
import { Toaster } from "react-hot-toast";

import About from "./_components/About";
import ContactInfo from "./_components/ContactInfo";
import Experience from "./_components/Experience";
import JobStatuses from "./_components/JobStatuses";
import PersonalInfo from "./_components/PersonalInfo";
import Photo from "./_components/Photo";
import Skills from "./_components/Skills";
import TimeSchedule from "./_components/TimeSchedule";
import Loading from "./loading";

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Profile" },
];

export default async function Profile() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileComponent />
    </Suspense>
  );
}

async function ProfileComponent() {
  const supabase = await createClientServerComponent();

  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  // Fetch user profile data
  const { data: user, error: userError } = await supabase
    .from("codev")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">Failed to load user profile</div>
      </div>
    );
  }

  // Fetch related data in parallel
  const [
    { data: education },
    { data: workExperience },
    { data: schedules },
    { data: jobStatuses },
  ] = await Promise.all([
    supabase.from("education").select("*").eq("codev_id", user.id),
    supabase.from("work_experience").select("*").eq("codev_id", user.id),
    supabase.from("work_schedules").select("*").eq("codev_id", user.id),
    supabase.from("job_status").select("*").eq("codev_id", user.id),
  ]);

  // Combine data
  const codevData = {
    ...user,
    education: education || [],
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      {user.application_status === "passed" && (
        <CustomBreadcrumb items={items} />
      )}

      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col gap-4 pt-4">
        <H1>Profile Settings</H1>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full basis-[70%] flex-col gap-8 2xl:basis-[60%]">
            <PersonalInfo data={codevData} />
            <About data={codevData} />
            <ContactInfo
              data={{
                facebook: user.facebook,
                linkedin: user.linkedin,
                github: user.github,
                discord: user.discord,
                portfolio_website: user.portfolio_website,
                phone_number: user.phone_number,
              }}
            />
            <Experience data={workExperience || []} />
          </div>
          <div className="flex w-full basis-[30%] flex-col gap-8 2xl:basis-[40%]">
            <Photo data={{ image_url: user.image_url || null }} />
            <Skills
              data={{
                tech_stacks: user.tech_stacks,
                level: user.level,
              }}
            />
            <TimeSchedule data={schedules?.[0] || null} />
            <JobStatuses data={jobStatuses || []} />
          </div>
        </div>
      </div>
    </div>
  );
}