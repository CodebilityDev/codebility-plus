import { redirect } from "next/navigation";
import { createClientServerComponent } from "@/utils/supabase/server";
import OnboardingClient from "./_components/OnboardingClient";

export default async function OnboardingPage() {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's codev data
  const { data: codevData, error: codevError } = await supabase
    .from("codev")
    .select("*")
    .eq("id", user.id)
    .single();

  if (codevError || !codevData) {
    console.error("Error fetching codev data:", codevError);
    redirect("/applicant/waiting");
  }

  // Check if user is in onboarding status
  if (codevData.application_status !== "onboarding") {
    redirect("/applicant/waiting");
  }

  // Fetch applicant data
  const { data: applicantData, error: applicantError } = await supabase
    .from("applicant")
    .select("*")
    .eq("codev_id", user.id)
    .single();

  if (applicantError || !applicantData) {
    console.error("Error fetching applicant data:", applicantError);
    redirect("/applicant/waiting");
  }

  return (
    <OnboardingClient
      user={codevData}
      applicantId={applicantData.id}
      applicantData={applicantData}
    />
  );
}
