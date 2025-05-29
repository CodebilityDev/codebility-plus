import React from "react";
import Profile from "@/app/home/settings/profile/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ApplicantProfileSettings() {
  return (
    <div>
      <Profile />
    </div>
  );
}
