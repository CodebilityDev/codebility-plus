"use server";

import { requirePermission } from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { AssigneeOption } from "@/types/home/kanban/kanban";
import { z } from "zod";

const querySchema = z.string();
const projectIdSchema = z.string().min(1);

const idsSchema = z.array(z.string().min(1));

const ASSIGNEE_COLUMNS =
  "id, first_name, last_name, image_url, display_position, username";

const ASSIGNEE_LIMIT = 20;

function toAssigneeOption(row: {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  display_position: string | null;
  username: string | null;
}): AssigneeOption {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    imageUrl: row.image_url,
    displayPosition: row.display_position,
    username: row.username,
  };
}

export async function searchAssignees(
  query: string,
  projectId: string,
): Promise<AssigneeOption[]> {
  const term = querySchema.parse(query).trim();
  const id = projectIdSchema.parse(projectId);

  await requirePermission("kanban");

  const supabase = await createClientServerComponent();

  let builder = supabase
    .from("codev")
    .select(`${ASSIGNEE_COLUMNS}, project_members!inner(project_id)`)
    .eq("application_status", "passed")
    .not("role_id", "is", null)
    .neq("role_id", 7)
    .eq("project_members.project_id", id);

  if (term) {
    const pattern = `%${term}%`;

    builder = builder.or(
      `first_name.ilike.${pattern},last_name.ilike.${pattern},username.ilike.${pattern}`,
    );
  }

  const { data, error } = await builder
    .order("first_name", { ascending: true })
    .limit(ASSIGNEE_LIMIT);

  if (error) throw error;

  return data.map(toAssigneeOption);
}

export async function getAssigneesByIds(ids: string[]): Promise<AssigneeOption[]> {
  const unique = [...new Set(idsSchema.parse(ids))];

  if (unique.length === 0) return [];

  await requirePermission("kanban");

  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("codev")
    .select(ASSIGNEE_COLUMNS)
    .in("id", unique);

  if (error) throw error;

  return data.map(toAssigneeOption);
}
