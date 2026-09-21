/**
 * The columns the "add members" picker selects, and the row shape every consumer
 * of its selection reads.
 *
 * Narrower than `Codev`, so the picker can page an explicit column list without
 * widening each row back to a full record just to satisfy a type. Lives outside
 * `actions/projects/actions.ts` because that file is a Server Actions module and
 * can only export async functions.
 */
export const MEMBER_LIST_COLUMNS =
  "id, first_name, last_name, email_address, display_position, image_url, role_id, internal_status, tech_stacks, level";

export type MemberListRow = {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  display_position: string | null;
  image_url: string | null;
  role_id: number | null;
  internal_status: string | null;
  tech_stacks: string[] | null;
  level: Record<string, unknown> | null;
};
