import React from "react";
import Image from "next/image";
import Link from "next/link";
import { H2, Paragraph } from "@/Components/shared/home";
import { Button } from "@/Components/ui/button";
import pathsConfig from "@/config/paths.config";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import { getApplicationStatus } from "../service";

export default async function CTA() {
  const supabase = getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await getApplicationStatus(user?.id!);

  return (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-5 text-center text-white">
      <Image
        src="/assets/images/CTA.png"
        alt="Codebility Devices"
        width={100}
        height={100}
        className="z-10 h-[200px] w-[200px] object-contain"
      />
      <H2 className="text-primaryColor capitalize">
        Become A <span className="text-[#9747FF]">Codev!</span>
      </H2>

      <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[550px]">
        Unlock your potential and embark on a journey of innovation and mastery
        with Codebility.
      </Paragraph>

      <Link
        href={
          data?.application_status === "ACCEPTED"
            ? pathsConfig.app.home
            : pathsConfig.auth.signIn
        }
      >
        <Button variant="purple" size="lg" rounded="full" className="md:w-40">
          {data?.application_status === "ACCEPTED" ? "Dashboard" : "Join Now"}
        </Button>
      </Link>
    </div>
  );
}
