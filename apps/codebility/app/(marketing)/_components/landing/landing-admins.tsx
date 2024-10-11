import React from "react";
import getRandomColor from "@/lib/getRandomColor";
import { getAdmins } from "@/lib/server/codev.service";
import { Profile } from "@/types/home/user";

import AdminCard from "./landing-admin-card";
import BlueBg from "./landing-blue-bg";

//we could put this into env, this is my userID -Zeff
const FOUNDER_USER_ID = "f99e3121-308c-4472-b4e8-dfd0ce593f72";

export default async function Admins() {
  const { data: admins, error } = await getAdmins();

  if (error) return <div>ERROR</div>;

  const sortedAdmins = admins
    ? [...admins].sort((a, b) => {
        if (a.user_id === FOUNDER_USER_ID) return -1;
        if (b.user_id === FOUNDER_USER_ID) return 1;
        return 0;
      })
    : [];

  return (
    <section id="admins" className="text-light-900 relative w-full pt-10">
      <h1 className="text-center text-3xl font-bold">Codebility Admins</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p className="pt-8 text-center md:px-44 ">
            Uncover what powers our {`platform's`} success. Our Admin team, with
            strategic skills and unyielding commitment, ensures CODEVS moves
            forward seamlessly towards greatness.
          </p>
          <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
            {sortedAdmins.map((admin: Profile) => (
              <AdminCard
                color={getRandomColor() || ""}
                key={admin.id}
                admin={admin}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
