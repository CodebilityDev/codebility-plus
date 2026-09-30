"use server";

import type { Codev } from "@/types/global/codev";
import { getCurrentCodev } from "@/lib/global/current-codev";

/**
 * Server action wrapper around `getCurrentCodev` so client components can
 * fetch the signed-in user without the page reading cookies itself.
 */
export async function getCurrentCodevAction(): Promise<Codev | null> {
  return getCurrentCodev();
}
