import { redirect } from "next/navigation";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import OnboardingClient from "@/components/applicant/onboarding/OnboardingClient";

export const instant = false;

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
    .select("id, first_name, last_name, application_status")
    .eq("id", user.id)
    .single();

  if (codevError) {
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
    .select(
      "id, quiz_passed, quiz_score, quiz_total, quiz_completed_at, commitment_signed_at",
    )
    .eq("codev_id", user.id)
    .single();

  if (applicantError) {
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