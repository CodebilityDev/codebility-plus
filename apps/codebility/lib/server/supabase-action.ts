import "server-only";
import { cache } from "react";

import z from "zod";
import { getCurrentCodev } from "./current-codev";

const UserSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
});

type User = z.infer<typeof UserSchema>;

/**
 * The signed-in user for server actions.
 *
 * This previously trusted a `supabase-user` cookie: it parsed the cookie and
 * returned it as the caller's identity WITHOUT verifying it against the
 * session. That cookie was written with no httpOnly/secure/sameSite options, so
 * any script (or the user) could set
 * `supabase-user={"id":"<victim-uuid>"}` and have actions act as that user.
 * Callers like updateCodev, work experience and education then wrote using that
 * id, which made it an authorization bypass rather than a stale read.
 *
 * Identity now comes from the verified session via getCurrentCodev, which is
 * React `cache()`d, so repeated calls within one request still resolve once.
 */
export const cachedUser = cache(async (): Promise<User | null> => {
  const codev = await getCurrentCodev();

  if (!codev) return null;

  return {
    id: codev.id,
    email: codev.email_address ?? undefined,
  };
});
