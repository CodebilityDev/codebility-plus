import React from "react";
import { createClient } from "@supabase/supabase-js";
import { Codev } from "@/types/home/codev";

import Section from "../MarketingSection";
import AnimatedAdminsSection from "./AnimatedAdminsSection";

const FOUNDER_USER_ID = process.env.NEXT_PUBLIC_FOUNDER_USER_ID || "";

export default async function Admins() {
  /**
   * Use anon Supabase client — NO cookie access, NO session reading.
   * This is a public marketing page. Using createClientServerComponent()
   * here was causing GoTrueClient to attempt a token refresh on every
   * page load for users with expired sessions → AuthApiError: refresh_token_not_found
   *
   * Fix: createClient() with anon key = no auth context = no token refresh attempt.
   */
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch admins (role_id: 1) and mentors (role_id: 5) in parallel
  const [
    { data: admins, error: adminError },
    { data: mentors, error: mentorError },
  ] = await Promise.all([
    supabase.from("codev").select("*").eq("role_id", 1),
    supabase.from("codev").select("*").eq("role_id", 5),
  ]);

  if (adminError || mentorError) return <div>ERROR</div>;

  const sortedAdmins = admins
    ? [...admins]
        .filter((admin) => admin.availability_status !== false)
        .sort((a, b) => {
          // Founder always first
          if (a.id === FOUNDER_USER_ID) return -1;
          if (b.id === FOUNDER_USER_ID) return 1;

          // Admins with profile pictures come before those without
          const aHasImage = !!a.image_url;
          const bHasImage = !!b.image_url;

          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;

          return 0;
        })
        .filter((admin) => !admin.display_position?.includes("Developer"))
    : [];

  const sortedMentors = mentors
    ? [...mentors]
        .filter((mentor) => mentor.availability_status !== false)
        .sort((a, b) => {
          const aHasImage = !!a.image_url;
          const bHasImage = !!b.image_url;

          if (aHasImage && !bHasImage) return -1;
          if (!aHasImage && bHasImage) return 1;

          return 0;
        })
    : [];

  // Format position text — handles UI/UX abbreviations and slashes
  const formatPosition = (position: string) => {
    const specialCases: Record<string, string> = {
      "ui/ux": "UI/UX",
      ui: "UI",
      ux: "UX",
    };

    return position
      .split(" ")
      .map((word) => {
        const lowerWord = word.toLowerCase();
        if (specialCases[lowerWord]) return specialCases[lowerWord];

        if (word.includes("/")) {
          return word
            .split("/")
            .map((part) => {
              const lowerPart = part.toLowerCase();
              return (
                specialCases[lowerPart] ||
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
              );
            })
            .join("/");
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  return (
    <Section id="admins" className="text-light-900 relative w-full pt-10">
      <AnimatedAdminsSection
        title="Codebility Admins"
        description="Uncover what powers our platform's success. Our Admin team, with strategic skills and unyielding commitment, ensures CODEVS moves forward seamlessly towards greatness."
        members={sortedAdmins.map((admin: Codev) => ({
          ...admin,
          display_position: admin.display_position
            ? formatPosition(admin.display_position)
            : admin.display_position,
        }))}
        sectionId="admins"
      />

      <div className="mt-20">
        <AnimatedAdminsSection
          title="Codebility Mentors"
          description="Meet our dedicated mentors who guide and support our developers on their journey to excellence. Their expertise and leadership help shape the future of our community."
          members={sortedMentors.map((mentor: Codev) => ({
            ...mentor,
            display_position: mentor.display_position
              ? formatPosition(mentor.display_position)
              : mentor.display_position,
          }))}
          sectionId="mentors"
        />
      </div>
    </Section>
  );
}