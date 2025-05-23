"use server";
import React from "react";

import Navigation from "../(marketing)/_components/MarketingNavigation";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-backgroundColor text-primaryColor relative flex h-auto min-h-screen flex-col">
      <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>
      <Navigation />
      <div className="z-30 h-full py-20">{children}</div>
    </div>
  );
}
