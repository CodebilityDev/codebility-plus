import React from "react";
import getRandomColor from "@/lib/getRandomColor";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import AdminCard from "./landing-admin-card";
import BlueBg from "./landing-blue-bg";

const FOUNDER_USER_ID = process.env.NEXT_PUBLIC_FOUNDER_USER_ID || "";

export default async function Admins() {
  const { data: admins, error } = await getCodevs({
    filters: { role_id: 1 },
  });

  if (error) return <div>ERROR</div>;

  const sortedAdmins = admins
    ? [...admins].sort((a, b) => {
        if (a.id === FOUNDER_USER_ID) return -1;
        if (b.id === FOUNDER_USER_ID) return 1;
        return 0;
      })
    : [];

  return (
    <section id="admins" className="text-light-900 relative w-full pt-10">
      <h1 className="text-center text-3xl font-bold">Codebility Admins</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p className="pt-8 text-center md:px-44">
            Uncover what powers our platform&apos;s success. Our Admin team,
            with strategic skills and unyielding commitment, ensures CODEVS
            moves forward seamlessly towards greatness.
          </p>
          <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
            {sortedAdmins.map((admin: Codev) => (
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
