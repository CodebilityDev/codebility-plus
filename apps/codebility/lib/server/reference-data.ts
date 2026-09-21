import { cache } from "react";
import { createClientServerComponent } from "@/utils/supabase/server";

export type RoleOption = { id: number; name: string };
export type PositionOption = { id: string; name: string | null };
export type ProjectOption = { id: string; name: string };

// Identical for every signed-in user, and read by several tables and their
// dialogs. Created per request by React `cache()`; the client bundle passes
// these down instead of each component re-querying them on mount.
export const getRoles = cache(async (): Promise<RoleOption[]> => {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase.from("roles").select("id, name");
  if (error) {
    console.error("Failed to fetch roles:", error);
    return [];
  }
  return (data ?? []) as RoleOption[];
});

export const getPositions = cache(async (): Promise<PositionOption[]> => {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase.from("positions").select("id, name");
  if (error) {
    console.error("Failed to fetch positions:", error);
    return [];
  }
  return (data ?? []) as PositionOption[];
});

export const getProjectOptions = cache(async (): Promise<ProjectOption[]> => {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase.from("projects").select("id, name");
  if (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
  return (data ?? []) as ProjectOption[];
});
