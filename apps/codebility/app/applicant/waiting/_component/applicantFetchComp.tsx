"use server";

import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserData } from "@/app/auth/declined/_service/actions";

import { applicantSchema } from "../_service/type";

import ApplicationSteps from "./applicationSteps";

export default async function ApplicantFetchComp() {
  const user = await getUserData();

  if (!user) {
    redirect("/auth/waiting");
  }

  const applicantData = applicantSchema.safeParse(user.applicant);

  if (applicantData.error) {
    redirect("/auth/waiting");
  }

  return (
    <section className=" text-primaryColor flex h-screen max-h-full w-screen max-w-full flex-col items-center justify-center overflow-hidden">
      <div className="flex w-full flex-col items-center text-center ">
        <ApplicationSteps user={user} applicantData={applicantData.data} />

        <div className="hero-bubble">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
