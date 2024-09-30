"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { Role } from "./_types/roles";

const supabase = getSupabaseServerComponentClient();

export async function createRole(roleData: Role) {
  const { data, error } = await supabase
    .from("roles")
    .insert(roleData)
    .select("*");

  revalidatePath("/home/settings/roles");
  return { success: true, data };
}
export async function updateRole(id: string, name: string) {
    
  const { data, error } = await supabase
    .from("roles")
    .update({ name })
    .eq("id", id)
    .single();

  console.log(data);
  console.log(error);
  revalidatePath("/home/settings/roles");
  return { success: true, data };
}
export async function deleteRole(id: string) {
  const { data } = await supabase.from("roles").delete().eq("id", id);
  revalidatePath("/home/settings/roles");
  return { success: true, data };
}
