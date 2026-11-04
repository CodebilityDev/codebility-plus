"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

import { authorize } from "@/lib/global/authorize";
import { expireCodevCaches } from "@/lib/global/cache-tags";
import { createClientServerComponent } from "@/lib/global/supabase-server";

export async function deleteAuthUser() {
  const identity = await authorize("settings");
  const supabase = await createClientServerComponent();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.DB_SERVICE_ROLE;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("[delete-auth-user] Missing Supabase environment variables.");
    return { error: "Server misconfiguration." };
  }

  const { error: rowError } = await supabase
    .from("codev")
    .delete()
    .eq("id", identity.userId);

  if (rowError) {
    console.error("Error deleting codev row:", rowError);
    return { error: "Failed to delete user data" };
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(identity.userId);

  if (deleteError) {
    console.error("Error deleting user:", deleteError);
    return { error: "Failed to delete user authentication" };
  }

  await expireCodevCaches();
  revalidatePath("/home/applicants");

  return { success: true, message: "User authentication deleted successfully" };
}
