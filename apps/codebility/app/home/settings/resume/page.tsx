/* eslint-disable no-unused-vars */

// import About from "@/app/home/settings/resume/About"
// import Photo from "@/app/home/settings/resume/Photo"

// import TimeSchedule from "@/app/home/settings/resume/TimeSchedule"
import { Toaster } from "react-hot-toast"
import { H1 } from "@/Components/shared/dashboard"
// import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@codevs/ui/breadcrumb"
import Experience from "./_components/experience"
import Skills from "./_components/skills"
import ContactInfo from "./_components/contact-info"
import PersonalInfo from "./_components/personal-info"
import About from "./_components/about"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"




const Resume = async () => { 
  
    const supabase = getSupabaseServerComponentClient()
    const {data: {user} } = await supabase.auth.getUser()
    const {data: profileData, error} = await supabase.from("profile").select().eq("id", user?.id).single()
    const{data: socialData} = await supabase.from("social").select().eq("id", user?.id).single()
  
  if (error) {
    console.error("Error fetching profile data:", error)
    // Handle error state or redirect as needed
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
           {/* <PersonalInfo data={profileData} />  
            <About data={profileData}/> */}
          {/* <ContactInfo data={socialData} /> */}
          {/* <Experience  /> */}
          <Skills data={profileData} />
        </div>
        <div className="flex w-full basis-[30%] flex-col gap-8">
          {/* <Photo user={userData} /> */}
          {/* <TimeSchedule /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Resume
