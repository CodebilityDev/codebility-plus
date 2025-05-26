"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { H1 } from "@/Components/shared/dashboard";
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb";
import { useUserStore } from "@/store/codev-store";
import { JobStatus, WorkExperience, WorkSchedule } from "@/types/home/codev";
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
import { createClientClientComponent } from "@/utils/supabase/client";

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Profile" },
];

export default function Profile() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileComponent />
    </Suspense>
  );
}

const ProfileComponent = () => {
  const { user, isLoading: userLoading } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [data, setData] = useState<{
    education: any[];
    workExperience: WorkExperience[];
    schedules: WorkSchedule[];
    jobStatuses: JobStatus[];
  }>({
    education: [],
    workExperience: [],
    schedules: [],
    jobStatuses: [],
  });
  const [error, setError] = useState<string | null>(null);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !isHydrated) return;

      try {
        const supabase = createClientClientComponent();
        const [
          { data: education, error: educationError },
          { data: workExperience, error: experienceError },
          { data: schedules, error: schedulesError },
          { data: jobStatuses, error: jobStatusesError },
        ] = await Promise.all([
          supabase.from("education").select("*").eq("codev_id", user.id),
          supabase.from("work_experience").select("*").eq("codev_id", user.id),
          supabase.from("work_schedules").select("*").eq("codev_id", user.id),
          supabase.from("job_status").select("*").eq("codev_id", user.id),
        ]);

        if (
          educationError ||
          experienceError ||
          schedulesError ||
          jobStatusesError
        ) {
          throw new Error("Error fetching data");
        }

        setData({
          education: education || [],
          workExperience: workExperience || [],
          schedules: schedules || [],
          jobStatuses: jobStatuses || [],
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id && isHydrated) {
      fetchData();
    }
  }, [user?.id, isHydrated]);

  // Show loading during hydration or user loading
  if (!isHydrated || userLoading) {
    return <Loading />;
  }

  // Check authentication
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Please log in to view your resume.</div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  // Combine store data with fetched relations
  const codevData = {
    ...user,
    education: data.education,
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
            <Experience data={data.workExperience} />
          </div>
          <div className="flex w-full basis-[30%] flex-col gap-8 2xl:basis-[40%]">
            <Photo data={{ image_url: user.image_url || null }} />
            <Skills
              data={{
                tech_stacks: user.tech_stacks,
                level: user.level,
              }}
            />
            <TimeSchedule data={data.schedules[0]} />
            <JobStatuses data={data.jobStatuses || []} />
          </div>
        </div>
      </div>
    </div>
  );
};
