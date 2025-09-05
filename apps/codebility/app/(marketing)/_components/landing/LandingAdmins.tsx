import React from "react";
import getRandomColor from "@/lib/getRandomColor";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import Section from "../MarketingSection";
import AdminCard from "./LandingAdminCard";
import BlueBg from "./LandingBlueBg";

const FOUNDER_USER_ID = process.env.NEXT_PUBLIC_FOUNDER_USER_ID || "";

export default async function Admins() {
  // Fetch both admins and mentors in parallel
  const [
    { data: admins, error: adminError },
    { data: mentors, error: mentorError },
  ] = await Promise.all([
    getCodevs({ filters: { role_id: 1 } }),
    getCodevs({ filters: { role_id: 5 } }),
  ]);

  if (adminError || mentorError) return <div>ERROR</div>;

  const sortedAdmins = admins
    ? [...admins].sort((a, b) => {
        // Founder always first
        if (a.id === FOUNDER_USER_ID) return -1;
        if (b.id === FOUNDER_USER_ID) return 1;

        // Admins with profile pictures come before those without
        const aHasImage = !!a.image_url;
        const bHasImage = !!b.image_url;

        if (aHasImage && !bHasImage) return -1;
        if (!aHasImage && bHasImage) return 1;

        // If both have images or both don't have images, maintain original order
        return 0;
      }).filter((admin) => !admin.display_position?.includes("Developer"))
    : [];

  const sortedMentors = mentors
    ? [...mentors].sort((a, b) => {
        // Mentors with profile pictures come before those without
        const aHasImage = !!a.image_url;
        const bHasImage = !!b.image_url;

        if (aHasImage && !bHasImage) return -1;
        if (!aHasImage && bHasImage) return 1;

        // If both have images or both don't have images, maintain original order
        return 0;
      })
    : [];

  // Helper function to format position text
  const formatPosition = (position: string) => {
    // Special cases for abbreviations
    const specialCases: Record<string, string> = {
      "ui/ux": "UI/UX",
      ui: "UI",
      ux: "UX",
    };

    return position
      .split(" ")
      .map((word) => {
        // Check if word is a special case (case-insensitive)
        const lowerWord = word.toLowerCase();
        if (specialCases[lowerWord]) {
          return specialCases[lowerWord];
        }

        // Handle words with slashes
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

        // Default capitalization
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  return (
    <Section id="admins" className="text-light-900 relative w-full pt-10">
      <div className="w-full">
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
                  color={getRandomColor() as string}
                  key={admin.id}
                  admin={{
                    ...admin,
                    display_position: admin.display_position
                      ? formatPosition(admin.display_position)
                      : admin.display_position,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h1 className="text-center text-3xl font-bold">Codebility Mentors</h1>
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-[1100px] px-4">
            <p className="pt-8 text-center md:px-44">
              Meet our dedicated mentors who guide and support our developers on
              their journey to excellence. Their expertise and leadership help
              shape the future of our community.
            </p>
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
            <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
              {sortedMentors.map((mentor: Codev) => (
                <AdminCard
                  color={getRandomColor() || ""}
                  key={mentor.id}
                  admin={{
                    ...mentor,
                    display_position: mentor.display_position
                      ? formatPosition(mentor.display_position)
                      : mentor.display_position,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
