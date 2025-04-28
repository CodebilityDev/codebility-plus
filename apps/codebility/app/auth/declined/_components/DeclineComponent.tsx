"use server";

import { Suspense } from "react";
import Logo from "@/Components/shared/Logo";

import { getUserData } from "../_service/actions";
import { getCanReApply } from "../_service/util";
import { DeclinedButtons } from "./DeclinedButtons";
import { DeclinedCountdown } from "./DeclinedCountdown";

export default async function DeclinedComponent() {
  const user = await getUserData();
  const canReapply = getCanReApply(user?.date_applied);

  if (!user) {
    return (
      <section className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
        <div className="h-screen w-screen animate-pulse bg-gray-200" />
      </section>
    );
  }

  return (
    <section className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-8 text-center lg:gap-10">
        <Logo />
        <div>
          <p className="mb-2 text-lg md:text-lg lg:text-2xl">
            Application Status Update
          </p>

          {canReapply ? (
            <p className="text-gray mx-auto text-xs md:max-w-[500px] md:text-lg">
              Unfortunately, your application was not accepted.
            </p>
          ) : (
            <p className="text-gray mx-auto text-xs md:max-w-[500px] md:text-lg">
              Unfortunately, your application was not accepted. You may reapply
              after 3 months.
            </p>
          )}
        </div>
        <DeclinedCountdown userData={user} />
        <DeclinedButtons userData={user} />

        <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]" />
        <div className="hero-bubble">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
