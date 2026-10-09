import type { Json } from "@/types/global/supabase";

export function asLevelRecord(value: Json | null | undefined): Record<string, any> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, any>;
  }
  return {};
}
