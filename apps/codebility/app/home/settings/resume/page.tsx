"use server"

import { Toaster } from "react-hot-toast"
import { H1 } from "@/Components/shared/dashboard"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@codevs/ui/breadcrumb"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import TimeSchedule from "./_components/time-schedule"
import Photo from "./_components/photo"
import PersonalInfo from "./_components/personal-info"
import About from "./_components/about"
import ContactInfo from "./_components/contact-info"

import Skills from "./_components/skills"
import Experience, { Experience_Type } from "./_components/experience"
import { Profile_Types, Social_Types } from "./_types/resume"

const Resume = async () => { 
  
    const supabase = getSupabaseServerComponentClient()
    const {data: {user} } = await supabase.auth.getUser()
    const {data: profileData, error: profileError} = await supabase.from("profile").select("*").eq("user_id", user?.id).single()
    const {data: socialData, error: socialError} = await supabase.from("social").select("*").eq("user_id", user?.id).single()
    const { data: experienceData, error: experienceError } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile_id", user?.id)
   
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Resume</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col gap-4 pt-4">
        <H1>Resume Settings</H1>
        {experienceError && socialError && profileError ? "Something went wrong!" : 
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full basis-[70%] flex-col gap-8">
           <PersonalInfo  data={profileData as Profile_Types}/> 
            <About data={profileData as Profile_Types}/> 
          <ContactInfo data={socialData as Social_Types} />
          <Experience data={experienceData as Experience_Type[]} />
          <Skills data={profileData as Profile_Types} />
        </div>
        <div className="flex w-full basis-[30%] flex-col gap-8">
        <Photo data={profileData as Profile_Types} />
          <TimeSchedule data={profileData as Profile_Types}/>
          </div>
        </div> }
      </div>
    </>
  );
};

export default Resume