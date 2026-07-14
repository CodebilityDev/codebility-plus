import { createClientServerComponent } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const tokenHash = requestUrl.searchParams.get("token_hash");

  if (tokenHash) {
    const cookieStore = await cookies();
    const supabase = await createClientServerComponent();

    // Recovery links carry a recovery token, so verify with the "recovery" OTP type.
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    // Honor verification failures: send the user to a clear sign-in/error state
    // instead of redirecting to the destination page unauthenticated.
    if (error) {
      return NextResponse.redirect(new URL("/auth/sign-in", origin));
    }

    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = await createClientServerComponent();

    try {
      // Fetch the role ID for "Applicant" from the roles table
      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "Applicant")
        .single();

      if (rolesError) {
        throw new Error(`Failed to fetch role ID: ${rolesError.message}`);
      }

      const applicantRoleId = rolesData?.id;

      // Ensure user is fetched from session or some other means
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not found or not authenticated");
      }

      // Determine whether this is a genuine first-time signup or an existing
      // approved user delivered through the recovery/sign-in `code` path.
      const { data: existingCodev } = await supabase
        .from("codev")
        .select("role_id, application_status")
        .eq("id", user.id)
        .single();

      const isExistingApprovedUser =
        !!existingCodev &&
        ((existingCodev.role_id != null &&
          existingCodev.role_id !== applicantRoleId) ||
          (existingCodev.application_status != null &&
            existingCodev.application_status !== "applying"));

      if (isExistingApprovedUser) {
        // Existing approved user: establish the session WITHOUT mutating
        // role_id/application_status, and route to their normal destination.
        await supabase.auth.exchangeCodeForSession(code);
        return NextResponse.redirect(
          new URL(redirectTo ?? "/home", requestUrl.origin),
        );
      }

      // Genuine first-time signup: assign the Applicant role and status.
      const { error: updateError } = await supabase
        .from("codev")
        .update({
          role_id: applicantRoleId,
          application_status: "applying",
        })
        .eq("id", user.id);

      if (updateError) {
        throw new Error(`Failed to update codev table: ${updateError.message}`);
      }

      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);

      // Redirect to waiting page after successful operation
      return NextResponse.redirect(new URL("/applicant/waiting", requestUrl.origin));
    } catch (error) {
      console.error("Error during role assignment or authentication:", error);
      return NextResponse.redirect(new URL("/auth/sign-in", requestUrl.origin));
    }
  }

  // No code present, redirect to sign-in
  return NextResponse.redirect(new URL("/auth/sign-in", requestUrl.origin));
}
