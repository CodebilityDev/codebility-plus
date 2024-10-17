"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { Role_Type } from "./_types/roles";

const supabase = getSupabaseServerComponentClient();

export async function createRole(roleData: Role_Type) {
  const { data, error } = await supabase
    .from("user_type")
    .insert(roleData)
    .select("*");

  revalidatePath("/home/settings/roles");
  return { success: true, data };
}
export async function updateRole(id: string, roleData: string) {

  const { data, error } = await supabase
    .from("user_type")
    .update({name: roleData}).eq("id", id).select("name").single()


  console.log(data);
  console.log(error);
  revalidatePath("/home/settings/roles");
  return { success: true, data };
}
export async function deleteRole(id: string) {
  const { data } = await supabase.from("user_type").delete().eq("id", id);
  revalidatePath("/home/settings/roles");
  return { success: true, data };
}
