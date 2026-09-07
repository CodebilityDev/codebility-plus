import { getCachedSkillCategories } from "@/lib/server/dashboard-reference-cached";
import { getCachedAllTimeTechnicalLeaderboard } from "@/lib/server/technical-leaderboard";

import WeeklyTopClient, { type TopCodev } from "./DashboardWeeklyTopClient";

/** Frontend Developer leads the category list when it exists. */
function orderCategories(names: string[]) {
  const ordered = [...names];
  const index = ordered.indexOf("Frontend Developer");

  if (index > 0) {
    const [frontend] = ordered.splice(index, 1);
    if (frontend) ordered.unshift(frontend);
  }

  return ordered;
}

export default async function WeeklyTop() {
  const categories = orderCategories(
    (await getCachedSkillCategories()).map((category) => category.name),
  );
  const defaultCategory = categories[0] ?? "";

  const leaders = defaultCategory
    ? ((await getCachedAllTimeTechnicalLeaderboard(defaultCategory, 10)) ?? [])
    : [];

  const initialLeaders: TopCodev[] = leaders.map((leader) => ({
    points: leader.total_points,
    codev: { first_name: leader.first_name },
    skill_category: { name: defaultCategory },
  }));

  return (
    <WeeklyTopClient
      categories={categories}
      initialCategory={defaultCategory}
      initialLeaders={initialLeaders}
    />
  );
}
