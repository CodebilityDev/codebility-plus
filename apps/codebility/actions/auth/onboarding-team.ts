"use server";

import { getCodevs } from "@/lib/server/codev.service";

const FOUNDER_USER_ID = process.env.NEXT_PUBLIC_FOUNDER_USER_ID || "";

export async function getTeamData() {
  // Fetch both admins and mentors in parallel
  const [
    { data: admins, error: adminError },
    { data: mentors, error: mentorError },
  ] = await Promise.all([
    getCodevs({ filters: { role_id: 1 } }), // Admin role
    getCodevs({ filters: { role_id: 5 } }), // Mentor role
  ]);

  if (adminError || mentorError) {
    return {
      success: false,
      admins: [],
      mentors: [],
      ceo: null,
    };
  }

  // Filter available admins and identify CEO
  const availableAdmins = (admins || []).filter(
    (admin) => admin.availability_status !== false
  );

  // Find CEO by founder user ID
  const founderAdmin = availableAdmins.find(
    (admin) => admin.id === FOUNDER_USER_ID
  );

  // Create CEO person object
  const ceo = founderAdmin
    ? {
        name: `${founderAdmin.first_name} ${founderAdmin.last_name}`.trim(),
        role: "Founder / CEO",
        image: founderAdmin.image_url || undefined,
      }
    : {
        name: "CEO Name",
        role: "Founder / CEO",
        image: undefined,
      };

  // Filter out CEO from admins list and sort
  const sortedAdmins = availableAdmins
    .filter((admin) => admin.id !== FOUNDER_USER_ID)
    .filter((admin) => !admin.display_position?.includes("Developer"))
    .sort((a, b) => {
      // Admins with profile pictures come before those without
      const aHasImage = !!a.image_url;
      const bHasImage = !!b.image_url;

      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;

      return 0;
    })
    .map((admin) => ({
      name: `${admin.first_name} ${admin.last_name}`.trim(),
      role: admin.display_position || "Admin",
      image: admin.image_url || undefined,
    }));

  // Sort and map mentors
  const sortedMentors = (mentors || [])
    .filter((mentor) => mentor.availability_status !== false)
    .sort((a, b) => {
      const aHasImage = !!a.image_url;
      const bHasImage = !!b.image_url;

      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;

      return 0;
    })
    .map((mentor) => ({
      name: `${mentor.first_name} ${mentor.last_name}`.trim(),
      role: mentor.display_position || "Mentor",
      image: mentor.image_url || undefined,
    }));

  return {
    success: true,
    admins: sortedAdmins,
    mentors: sortedMentors,
    ceo,
  };
}
