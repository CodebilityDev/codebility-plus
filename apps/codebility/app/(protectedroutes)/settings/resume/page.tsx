"use client"

import About from "@/app/(protectedroutes)/settings/resume/About"
import Photo from "@/app/(protectedroutes)/settings/resume/Photo"
import Experience from "@/app/(protectedroutes)/settings/resume/Experience"
import useAuth from "@/hooks/use-auth"
import ContactInfo from "@/app/(protectedroutes)/settings/resume/ContactInfo"
import PersonalInfo from "@/app/(protectedroutes)/settings/resume/PersonalInfo"
import TimeSchedule from "@/app/(protectedroutes)/settings/resume/TimeSchedule"
import { Toaster } from "react-hot-toast"
import { H1 } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@codevs/ui/breadcrumb"

const Resume = () => {
  const { userData, isLoading } = useAuth()

  if (isLoading) {
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

        <H1 className="pt-4">Resume Settings</H1>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex w-full basis-[60%] flex-col gap-6">
            <Skeleton className="h-[450px] w-full" />
            <Skeleton className="h-[450px] w-full" />
            <Skeleton className="h-[450px] w-full" />
          </div>
          <div className="flex basis-[40%]">
            <Skeleton className="h-[450px] w-full" />
          </div>
        </div>
      </>
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
            <PersonalInfo user={userData} />
            <About user={userData} />
            <ContactInfo user={userData} />
            <Experience user={userData} />
          </div>
          <div className="flex w-full basis-[30%] flex-col gap-8">
            <Photo user={userData} />
            <TimeSchedule />
          </div>
        </div>
      </div>
    </>
  )
}

export default Resume