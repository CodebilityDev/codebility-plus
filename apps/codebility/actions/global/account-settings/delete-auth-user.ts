"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { expireCodevCaches } from "@/lib/global/cache-tags";
import { createClientServerComponent } from "@/lib/global/supabase-server";

export async function deleteAuthUser() {
  const supabase = await createClientServerComponent();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized" };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.DB_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[delete-auth-user] Missing Supabase environment variables.");
    return { error: "Server misconfiguration." };
  }

  const { error: rowError } = await supabase
    .from("codev")
    .delete()
    .eq("id", user.id);

  if (rowError) {
    console.error("Error deleting codev row:", rowError);
    return { error: "Failed to delete user data" };
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("Error deleting user:", deleteError);
    return { error: "Failed to delete user authentication" };
  }

  await expireCodevCaches();
  revalidatePath("/home/applicants");

  return { success: true, message: "User authentication deleted successfully" };
}