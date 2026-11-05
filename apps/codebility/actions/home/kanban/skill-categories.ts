"use server";

import { authorize } from "@/lib/global/authorize";
import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import type { SkillCategoryOption } from "@/types/home/kanban/kanban";

export async function getTaskSkillCategories(): Promise<SkillCategoryOption[]> {
  await authorize("kanban");

  const categories = await getSkillCategories();

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
}
