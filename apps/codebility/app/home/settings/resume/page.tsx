/* eslint-disable no-unused-vars */
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
import Experience from "./_components/experience"





const Resume = async () => { 
  
    const supabase = getSupabaseServerComponentClient()
    const {data: {user} } = await supabase.auth.getUser()
    const {data: profileData, error} = await supabase.from("profile").select().eq("id", user?.id).single()
    const {data: socialData} = await supabase.from("social").select().eq("id", user?.id).single()
    
    const {data: getWorkExperienceData} = await supabase.from("experience").select().eq("id", user?.id)
    console.log("ayooo", getWorkExperienceData)
    
  if (error) {
    console.error("Error fetching profile data:", error)
    return (
      <div>Error loading profile data</div>
    )
  }

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
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full basis-[70%] flex-col gap-8">
           {/* <PersonalInfo  data={profileData}/> 
            <About about={profileData.about}/> 
          <ContactInfo data={socialData} /> */}
          <Experience />
          {/* <Skills data={profileData} /> */}
        </div>
        <div className="flex w-full basis-[30%] flex-col gap-8">
        <Photo data={{ image_url: profileData.image_url }} />
          <TimeSchedule startTime={profileData.start_time} endTime={profileData.end_time}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Resume