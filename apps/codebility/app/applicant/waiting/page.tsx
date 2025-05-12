import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserData } from "@/app/auth/declined/_service/actions";

import ApplicationSteps from "./_component/applicationSteps";
import { applicantSchema } from "./_service/type";
import Loading from "./loading";

export default async function ApplicantWaitingPage() {
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
        <Suspense fallback={<Loading />}>
          <ApplicationSteps user={user} applicantData={applicantData.data} />
        </Suspense>

        <div className="hero-bubble">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
