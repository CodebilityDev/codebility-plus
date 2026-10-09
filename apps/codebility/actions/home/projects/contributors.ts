"use server";

import { updateTag } from "next/cache";
import { CANDIDATE_COLUMNS } from "@/constants/home/projects/projects";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { requireFullAccess } from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { ContributorCandidate } from "@/types/home/projects/projects";
import { z } from "zod";

type ServerClient = Awaited<ReturnType<typeof createClientServerComponent>>;

const projectIdSchema = z.string().min(1);
const codevIdSchema = z.string().min(1);
const contributorIdsSchema = z.array(codevIdSchema);
const searchQuerySchema = z.string();

const selectableContributorQuery = <Columns extends string>(
  supabase: ServerClient,
  columns: Columns,
) =>
  supabase
    .from("codev")
    .select(columns)
    .eq("application_status", "passed")
    .not("role_id", "is", null)
    .neq("role_id", 7);

export async function searchContributorCandidates(
  query: string,
): Promise<ContributorCandidate[]> {
  const term = searchQuerySchema.parse(query).trim();

  await requireFullAccess();

  const supabase = await createClientServerComponent();

  let candidateQuery = selectableContributorQuery(supabase, CANDIDATE_COLUMNS);

  if (term) {
    const pattern = `%${term}%`;

    candidateQuery = candidateQuery.or(
      `first_name.ilike.${pattern},last_name.ilike.${pattern},username.ilike.${pattern}`,
    );
  }

  const { data, error } = await candidateQuery
    .order("first_name", { ascending: true })
    .limit(20);

  if (error) throw error;

  return data.flatMap((row) =>
    row.roles
      ? [
          {
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            imageUrl: row.image_url,
            displayPosition: row.display_position,
            username: row.username,
            roleName: row.roles.name,
          },
        ]
      : [],
  );
}

export async function addContributors(
  projectId: string,
  codevIds: string[],
): Promise<void> {
  const id = projectIdSchema.parse(projectId);
  const ids = [...new Set(contributorIdsSchema.parse(codevIds))];

  await requireFullAccess();

  const supabase = await createClientServerComponent();

  if (ids.length > 0) {
    const { data: selectable, error: selectableError } =
      await selectableContributorQuery(supabase, "id").in("id", ids);

    if (selectableError) throw selectableError;

    if (selectable.length !== ids.length) {
      throw new Error("One or more contributors are not selectable");
    }
  }

  const { data: members, error: membersError } = await supabase
    .from("project_members")
    .select("codev_id")
    .eq("project_id", id);

  if (membersError) throw membersError;

  const memberIds = new Set(members.map((member) => member.codev_id));
  const newIds = ids.filter((codevId) => !memberIds.has(codevId));

  if (newIds.length > 0) {
    const { error: insertError } = await supabase.from("project_members").insert(
      newIds.map((codevId) => ({
        project_id: id,
        codev_id: codevId,
        role: "member",
        joined_at: new Date().toISOString(),
      })),
    );

    if (insertError) throw insertError;
  }

  updateTag(`${CACHE_TAGS.projectDetail}-${id}`);
}

export async function removeContributor(
  projectId: string,
  codevId: string,
): Promise<void> {
  const id = projectIdSchema.parse(projectId);
  const contributorId = codevIdSchema.parse(codevId);

  await requireFullAccess();

  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", id)
    .eq("codev_id", contributorId);

  if (error) throw error;

  updateTag(`${CACHE_TAGS.projectDetail}-${id}`);
}
