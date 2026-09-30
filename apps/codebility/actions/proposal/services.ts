"use server";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import { serviceWriteSchema } from "@/utils/global/proposal";
import type { ServiceWriteInput } from "@/types/global/proposal";


async function requireAdminUser():
  Promise<
    | { ok: true; supabase: Awaited<ReturnType<typeof createClientServerComponent>>; userId: string }
    | { ok: false; error: string }
  > {
  const supabase = await createClientServerComponent();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    return { ok: false, error: "Authentication required" };
  }

  const { data: userRole, error: roleError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.user.id)
    .single();

  if (roleError || userRole?.role_id !== 1) {
    return { ok: false, error: "Admin access required" };
  }

  return { ok: true, supabase, userId: user.user.id };
}

export async function createService(formData: ServiceWriteInput) {
  try {
    const validated = serviceWriteSchema.parse(formData);
    const auth = await requireAdminUser();
    if (!auth.ok) {
      return { error: auth.error };
    }

    const { error } = await auth.supabase.from("services").insert({
      ...validated,
      created_by: auth.userId,
    });

    if (error) {
      console.error("Error creating service:", error);
      return { error: "Failed to create service" };
    }

    return { error: null };
  } catch (error) {
    console.error("Error creating service:", error);
    return { error: "Failed to create service" };
  }
}

export async function updateService(id: string, formData: ServiceWriteInput) {
  try {
    const validated = serviceWriteSchema.parse(formData);
    const auth = await requireAdminUser();
    if (!auth.ok) {
      return { error: auth.error };
    }

    const { error } = await auth.supabase
      .from("services")
      .update(validated)
      .eq("id", id);

    if (error) {
      console.error("Error updating service:", error);
      return { error: "Failed to update service" };
    }

    return { error: null };
  } catch (error) {
    console.error("Error updating service:", error);
    return { error: "Failed to update service" };
  }
}