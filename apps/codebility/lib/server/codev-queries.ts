/**
 * Codev Query Utilities
 *
 * IMPORTANT: These utilities prevent RLS policy issues with the role_id field.
 *
 * ### Known Issue: RLS Role ID Corruption
 * When querying all users without filtering by role_id, Supabase RLS policies
 * corrupt the role_id field, returning incorrect values:
 *
 * ❌ WRONG:
 * ```ts
 * const { data } = await supabase.from("codev").select("*");
 * // Returns 1000 users, but only 5 have correct role_id values
 * ```
 *
 * ✅ CORRECT:
 * ```ts
 * const { data } = await supabase.from("codev").select("*").eq("role_id", 5);
 * // Returns all 11 mentors with correct role_id values
 * ```
 *
 * ### Solution
 * Always use `fetchCodevsByRole()` or `fetchAllCodevsWithCorrectRoles()`
 * instead of direct queries when you need accurate role_id data.
 */

import { createClient } from "@supabase/supabase-js";

export const ROLE_IDS = {
  ADMIN: 1,
  MENTOR: 5,
  APPLICANT: 7,
  CODEV: 10,
} as const;

interface CodevQueryOptions {
  selectFields?: string;
  includeNullRoles?: boolean;
}

/**
 * Fetch codevs by a specific role ID
 * This ensures role_id field is returned correctly by RLS policies
 *
 * @param roleId - The role ID to filter by (use ROLE_IDS constants)
 * @param options - Query options
 */
export async function fetchCodevsByRole(
  roleId: number,
  options: CodevQueryOptions = {}
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const selectFields = options.selectFields || "*";

  const { data, error } = await supabase
    .from("codev")
    .select(selectFields)
    .eq("role_id", roleId);

  if (error) {
    console.error(`Error fetching codevs with role_id ${roleId}:`, error);
    return [];
  }

  return data || [];
}

/**
 * Fetch ALL codevs with correct role_id values
 *
 * Queries each role separately to avoid RLS corruption, then combines results.
 * Use this instead of a single query when you need accurate role_id data.
 *
 * @param options - Query options
 */
export async function fetchAllCodevsWithCorrectRoles(
  options: CodevQueryOptions = {}
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const selectFields = options.selectFields || "*";
  const roleIds = [
    ROLE_IDS.ADMIN,
    ROLE_IDS.MENTOR,
    ROLE_IDS.APPLICANT,
    ROLE_IDS.CODEV,
  ];

  // Build queries for each role
  const queries = roleIds.map((roleId) =>
    supabase.from("codev").select(selectFields).eq("role_id", roleId)
  );

  // Optionally include users with null role_id
  if (options.includeNullRoles) {
    queries.push(
      supabase.from("codev").select(selectFields).is("role_id", null)
    );
  }

  // Execute all queries in parallel
  const results = await Promise.all(queries);

  // Combine results
  let allCodevs: any[] = [];
  results.forEach(({ data, error }, index) => {
    if (error) {
      const roleId = index < roleIds.length ? roleIds[index] : "null";
      console.error(`Error fetching role_id ${roleId}:`, error);
    } else if (data) {
      allCodevs = allCodevs.concat(data);
    }
  });

  return allCodevs;
}

/**
 * Fetch mentors (role_id = 5)
 * Convenience wrapper around fetchCodevsByRole
 */
export async function fetchMentors(selectFields?: string) {
  return fetchCodevsByRole(ROLE_IDS.MENTOR, { selectFields });
}

/**
 * Fetch admins (role_id = 1)
 * Convenience wrapper around fetchCodevsByRole
 */
export async function fetchAdmins(selectFields?: string) {
  return fetchCodevsByRole(ROLE_IDS.ADMIN, { selectFields });
}

/**
 * Fetch codevs (role_id = 10)
 * Convenience wrapper around fetchCodevsByRole
 */
export async function fetchCodevs(selectFields?: string) {
  return fetchCodevsByRole(ROLE_IDS.CODEV, { selectFields });
}
