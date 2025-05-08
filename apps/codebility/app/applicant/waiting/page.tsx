import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getUserData } from "@/app/auth/declined/_service/actions";

import ApplicationSteps from "./_component/applicationSteps";
import { getApplicantData } from "./_service/action";
import Loading from "./loading";

export default async function ApplicantWaitingPage() {
  const user = await getUserData();
  const applicantData = await getApplicantData(user.applicant_id);

  if (!applicantData) {
    redirect("/auth/waiting");
  }

  return (
    <section className=" text-primaryColor flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <div className="flex w-full flex-col items-center text-center ">
        <Suspense fallback={<Loading />}>
          <ApplicationSteps user={user} applicantData={applicantData} />
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
