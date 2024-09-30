"use server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { Role } from "./_types/roles";

const supabase = getSupabaseServerComponentClient();

export async function createRole(roleData: Role) {
  const { data, error } = await supabase
    .from("roles")
    .insert(roleData)
    .select("*");
  if (error) {
    throw new Error();
  }
  return data;
}
export async function updateRole(roleData: any) {
  const { data, error } = await supabase.from("roles").update(roleData);
  // .eq("id", id);

  console.log(data);
  console.log(error);
  return data;
}
export async function deleteRole(id: string) {
  return await supabase.from("roles").delete().eq("id", id);
}
