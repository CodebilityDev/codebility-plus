import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const fetchUserData = async () => {
  const supabase = createClientComponentClient();

  // Ensure session is properly typed and handled
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData?.session?.user) {
    console.error(
      "Failed to retrieve session or user is not logged in:",
      sessionError,
    );
    return null;
  }

  const userId = sessionData.session.user.id;

  const { data: userData, error: userError } = await supabase
    .from("codev")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Failed to fetch user data:", userError);
    return null;
  }

  return userData;
};
