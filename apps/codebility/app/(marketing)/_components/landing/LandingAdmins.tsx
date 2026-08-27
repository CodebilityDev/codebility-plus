import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { Codev } from "@/types/home/codev";
import { createClientAnon } from "@/utils/supabase/anon";

import Section from "../MarketingSection";
import { ADMINS_SECTION_COPY } from "../../_lib/constants";
import AnimatedAdminsSection from "./AnimatedAdminsSection";
import { LandingAdminsSkeleton } from "./LandingAdminsSkeleton";

const FOUNDER_USER_ID = process.env.NEXT_PUBLIC_FOUNDER_USER_ID || "";

const ADMIN_SELECT =
  "id, first_name, last_name, image_url, display_position, availability_status, role_id";

function formatPosition(position: string) {
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
}

function sortMembers(members: Codev[], founderFirst = false) {
  return [...members]
    .filter((member) => member.availability_status !== false)
    .sort((a, b) => {
      if (founderFirst) {
        if (a.id === FOUNDER_USER_ID) return -1;
        if (b.id === FOUNDER_USER_ID) return 1;
      }

      const aHasImage = !!a.image_url;
      const bHasImage = !!b.image_url;

      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;

      return 0;
    });
}

function mapMembers(members: Codev[]) {
  return members.map((member) => ({
    ...member,
    display_position: member.display_position
      ? formatPosition(member.display_position)
      : member.display_position,
  }));
}

const getLandingAdmins = unstable_cache(
  async () => {
    const supabase = createClientAnon();

    const [
      { data: admins, error: adminError },
      { data: mentors, error: mentorError },
    ] = await Promise.all([
      supabase.from("codev").select(ADMIN_SELECT).eq("role_id", 1),
      supabase.from("codev").select(ADMIN_SELECT).eq("role_id", 5),
    ]);

    if (adminError || mentorError) return null;

    return {
      admins: mapMembers(
        sortMembers((admins ?? []) as Codev[], true).filter(
          (admin) => !admin.display_position?.includes("Developer"),
        ),
      ),
      mentors: mapMembers(sortMembers((mentors ?? []) as Codev[])),
    };
  },
  ["landing-admins"],
  { revalidate: 3600, tags: ["landing-admins"] },
);

async function LandingAdminsContent() {
  const data = await getLandingAdmins();
  if (!data) return <div>ERROR</div>;

  return (
    <>
      <AnimatedAdminsSection
        {...ADMINS_SECTION_COPY.admins}
        members={data.admins}
        sectionId="admins"
      />

      <div className="mt-20">
        <AnimatedAdminsSection
          {...ADMINS_SECTION_COPY.mentors}
          members={data.mentors}
          sectionId="mentors"
        />
      </div>
    </>
  );
}

export default function Admins() {
  return (
    <Section id="admins" className="text-light-900 relative w-full pt-10">
      <div data-landing-section>
        <div data-landing-skeleton>
          <LandingAdminsSkeleton />
        </div>
        <div data-landing-content>
          <Suspense fallback={<LandingAdminsSkeleton />}>
            <LandingAdminsContent />
          </Suspense>
        </div>
      </div>
    </Section>
  );
}
