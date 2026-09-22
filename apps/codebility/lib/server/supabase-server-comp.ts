"use server";

import { cache } from "react";
import z from "zod";
import { getCurrentCodev } from "./current-codev";

const UserSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
});

type User = z.infer<typeof UserSchema>;

/**
 * The signed-in user, for server components that only need an identity.
 *
 * This read the `supabase-user` cookie and returned it WITHOUT any session
 * check, so a caller-supplied cookie value was treated as the signed-in user.
 * The cookie is not httpOnly, so it is trivially forgeable from the browser.
 *
 * Identity now comes from the verified session. `getCurrentCodev` is React
 * `cache()`d, so this stays a single resolve per request.
 */
export const getCachedUser = cache(async (): Promise<User | null> => {
  const codev = await getCurrentCodev();

  if (!codev) return null;

  return UserSchema.parse({
    id: codev.id,
    email: codev.email_address ?? undefined,
  });
});
