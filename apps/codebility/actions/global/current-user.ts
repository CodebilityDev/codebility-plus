"use server";

import { getCurrentCodev } from "@/lib/global/current-codev";
import type { CurrentUserProfile } from "@/types/global/current-user";

/**
 * Server action wrapper around `getCurrentCodev` so client components can
 * fetch the signed-in user without the page reading cookies itself.
 */
export async function getCurrentCodevAction(): Promise<CurrentUserProfile | null> {
  return getCurrentCodev();
}