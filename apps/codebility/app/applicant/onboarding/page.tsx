import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import OnboardingClient from "@/components/applicant/onboarding/OnboardingClient";
import OnboardingSkeleton from "@/components/applicant/onboarding/OnboardingSkeleton";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingGate />
    </Suspense>
  );
}

async function OnboardingGate() {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: codevData, error: codevError } = await supabase
    .from("codev")
    .select("id, first_name, last_name, application_status")
    .eq("id", user.id)
    .single();

  if (codevError) {
    throw codevError;
  }

  if (codevData.application_status !== "onboarding") {
    redirect("/applicant/waiting");
  }

  const { data: applicantData, error: applicantError } = await supabase
    .from("applicant")
    .select(
      "id, quiz_passed, quiz_score, quiz_total, quiz_completed_at, commitment_signed_at",
    )
    .eq("codev_id", user.id)
    .single();

  if (applicantError) {
    throw applicantError;
  }

  return (
    <OnboardingClient
      user={codevData}
      applicantId={applicantData.id}
      applicantData={applicantData}
    />
  );
}
