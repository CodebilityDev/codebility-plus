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
    const {data: profileDatas} = await supabase.from("profile").select().eq("id", user?.id).single()
  
 
  // if (isLoading) {
  //   return (
  //     <>
  //       <Breadcrumb>
  //         <BreadcrumbList>
  //           <BreadcrumbItem>
  //             <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
  //           </BreadcrumbItem>
  //           <BreadcrumbSeparator />
  //           <BreadcrumbItem>Resume</BreadcrumbItem>
  //         </BreadcrumbList>
  //       </Breadcrumb>

  //       <H1 className="pt-4">Resume Settings</H1>
  //       <div className="flex flex-col gap-8 md:flex-row">
  //         <div className="flex w-full basis-[60%] flex-col gap-6">
  //           <Skeleton className="h-[450px] w-full" />
  //           <Skeleton className="h-[450px] w-full" />
  //           <Skeleton className="h-[450px] w-full" />
  //         </div>
  //         <div className="flex basis-[40%]">
  //           <Skeleton className="h-[450px] w-full" />
  //         </div>
  //       </div>
  //     </>
  //   )
  // }
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
           <PersonalInfo user={profileDatas} />  
          {/* <About />
          <ContactInfo  /> */}
          {/* <Experience  /> */}
          {/* <Skills/> */}
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
