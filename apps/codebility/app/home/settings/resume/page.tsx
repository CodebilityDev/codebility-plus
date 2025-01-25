"use client";

import { useEffect, useState } from "react";
import { H1 } from "@/Components/shared/dashboard";
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb";
import { useUserStore } from "@/store/codev-store";
import { WorkExperience, WorkSchedule } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Toaster } from "react-hot-toast";

import About from "./_components/resume-about";
import ContactInfo from "./_components/resume-contact-info";
import Experience from "./_components/resume-experience";
import PersonalInfo from "./_components/resume-personal-info";
import Photo from "./_components/resume-photo";
import Skills from "./_components/resume-skills";
import TimeSchedule from "./_components/resume-time-schedule";

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Resume" },
];

const Resume = () => {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    education: any[];
    workExperience: WorkExperience[];
    schedules: WorkSchedule[];
  }>({
    education: [],
    workExperience: [],
    schedules: [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const supabase = createClientComponentClient();
        const [
          { data: education, error: educationError },
          { data: workExperience, error: experienceError },
          { data: schedules, error: schedulesError },
        ] = await Promise.all([
          supabase.from("education").select("*").eq("codev_id", user.id),
          supabase.from("work_experience").select("*").eq("codev_id", user.id),
          supabase.from("work_schedules").select("*").eq("codev_id", user.id),
        ]);

        if (educationError || experienceError || schedulesError) {
          throw new Error("Error fetching data");
        }

        setData({
          education: education || [],
          workExperience: workExperience || [],
          schedules: schedules || [],
        });
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (!user) {
    return <div>Please log in to view your resume.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Combine store data with fetched relations
  const codevData = {
    ...user,
    education: data.education,
  };

  return (
    <div className="mx-auto max-w-screen-xl">
      <CustomBreadcrumb items={items} />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col gap-4 pt-4">
        <H1>Resume Settings</H1>
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
              }}
            />
            <Experience data={data.workExperience} />
            <Skills
              data={{
                tech_stacks: user.tech_stacks,
                level: user.level,
              }}
            />
          </div>
          <div className="flex w-full basis-[30%] flex-col gap-8 2xl:basis-[40%]">
            <Photo data={{ image_url: user.image_url }} />
            <TimeSchedule data={data.schedules[0]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
