"use server";

import { H1 } from "@/Components/shared/dashboard";
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb";
import { Toaster } from "react-hot-toast";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import About from "./_components/resume-about";
import ContactInfo from "./_components/resume-contact-info";
import Experience, { Experience_Type } from "./_components/resume-experience";
import PersonalInfo from "./_components/resume-personal-info";
import Photo from "./_components/resume-photo";
import Skills from "./_components/resume-skills";
import TimeSchedule from "./_components/resume-time-schedule";
import { Profile_Types, Social_Types } from "./_types/resume";

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Resume" },
];

const Resume = async () => {
  const supabase = getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profileData, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("user_id", user?.id)
    .single();
  const { data: socialData, error: socialError } = await supabase
    .from("social")
    .select("*")
    .eq("user_id", user?.id)
    .single();
  const { data: experienceData, error: experienceError } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile_id", user?.id);

  return (
    <div className="mx-auto max-w-screen-xl">
      <CustomBreadcrumb items={items} />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col gap-4 pt-4">
        <H1>Resume Settings</H1>
        {experienceError && socialError && profileError ? (
          "Something went wrong!"
        ) : (
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex w-full basis-[70%] flex-col gap-8">
              <PersonalInfo data={profileData as Profile_Types} />
              <About data={profileData as Profile_Types} />
              <ContactInfo data={socialData as Social_Types} />
              <Experience data={experienceData as Experience_Type[]} />
              <Skills data={profileData as Profile_Types} />
            </div>
            <div className="flex w-full basis-[30%] flex-col gap-8">
              <Photo data={profileData as Profile_Types} />
              <TimeSchedule data={profileData as Profile_Types} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
