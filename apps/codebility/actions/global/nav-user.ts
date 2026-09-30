"use server";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { NavUserProfile } from "@/types/global/database";

// The signed-in user's name, avatar and status for the marketing navbar.
export async function getNavUserProfile(): Promise<NavUserProfile | null> {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("codev")
    .select("first_name, last_name, email_address, image_url, application_status, role_id, applicant (id, codev_id)")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return {
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email_address,
    image_url: profile.image_url,
    application_status: profile.application_status,
    role_id: profile.role_id,
    applicant: profile.applicant ?? null,
  };
}