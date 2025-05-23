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
    const cookieStore = cookies();
    const supabase = await createClientServerComponent();

    await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "email" });

    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  if (code) {
    const cookieStore = cookies();
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

      // Update the codev table with the Applicant role ID and application status
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
      return NextResponse.redirect(new URL("/auth/waiting", requestUrl.origin));
    } catch (error) {
      console.error("Error during role assignment or authentication:", error);
      return NextResponse.redirect(new URL("/auth/sign-in", requestUrl.origin));
    }
  }

  // No code present, redirect to sign-in
  return NextResponse.redirect(new URL("/auth/sign-in", requestUrl.origin));
}
