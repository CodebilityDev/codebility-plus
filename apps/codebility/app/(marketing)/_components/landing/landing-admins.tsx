import React from "react"
import getRandomColor from "@/lib/getRandomColor"
import BlueBg from "./landing-blue-bg" 
import AdminCard from "./landing-admin-card"
import { User } from "@/types"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"

export default async function Admins() {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("user")
  .select(`
    *,
    profile(*)
  `);

  if (error) return <div>ERROR</div>

  return (
    <section id="admins" className="relative w-full pt-10 text-light-900">
      <h1 className="text-center text-3xl font-bold">Codebility Admins</h1>
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p className="pt-8 text-center md:px-44 ">
            Uncover what powers our {`platform's`} success. Our Admin team, with strategic skills and unyielding
            commitment, ensures CODEVS moves forward seamlessly towards greatness.
          </p>
          <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
           {/*  {admins.map((admin: { admin: User; color: string }["admin"]) => (
              <AdminCard color={getRandomColor() || ""} key={admin.id} admin={admin} />
            ))} */}
          </div>
        </div>
      </div>
    </section>
  )
}