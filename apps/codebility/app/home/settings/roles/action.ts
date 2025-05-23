"use server";

import { revalidatePath } from "next/cache";
import { Roles } from "@/types/home/codev"; // <-- your Roles interface
import { createClientServerComponent } from "@/utils/supabase/server";





/**
 * CREATE a new role
 */
export async function createRole(roleData: Partial<Roles>) {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase
    .from("roles") // <-- 'roles' table
    .insert(roleData)
    .select("*");

  if (error) {
    console.error("Error creating role:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/settings/roles");
  return { success: true, data };
}

/**
 * UPDATE an existing role by integer ID
 */
export async function updateRole(id: number, roleData: Partial<Roles>) {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase
    .from("roles") // <-- 'roles' table
    .update(roleData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating role:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/settings/roles");
  return { success: true, data };
}

/**
 * DELETE a role by integer ID
 */
export async function deleteRole(id: number) {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase
    .from("roles") // <-- 'roles' table
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting role:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/settings/roles");
  return { success: true, data };
}
