"use server";

import { requirePermission } from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { AssigneeOption } from "@/types/home/kanban/kanban";
import { z } from "zod";

const querySchema = z.string();

const ASSIGNEE_COLUMNS =
  "id, first_name, last_name, image_url, display_position, username";

const ASSIGNEE_LIMIT = 20;

export async function searchAssignees(query: string): Promise<AssigneeOption[]> {
  const term = querySchema.parse(query).trim();

  await requirePermission("kanban");

  const supabase = await createClientServerComponent();

  let builder = supabase
    .from("codev")
    .select(ASSIGNEE_COLUMNS)
    .eq("application_status", "passed")
    .not("role_id", "is", null)
    .neq("role_id", 7);

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

  return data.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    imageUrl: row.image_url,
    displayPosition: row.display_position,
    username: row.username,
  }));
}
