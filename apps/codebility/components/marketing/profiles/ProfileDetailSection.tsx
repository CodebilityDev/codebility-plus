import { notFound } from "next/navigation";

import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import { getCachedProfileDetail } from "@/lib/marketing/profiles/profile-detail-cached";

import ProfileContent from "@/components/marketing/profiles/ProfileDetailContent";
import type { ProfilesIdPageProps } from "@/types/marketing/profiles/profiles";

export async function ProfileDetailSection({ params }: ProfilesIdPageProps) {
  const { id } = await params;
  const [codev, skillCategories] = await Promise.all([
    getCachedProfileDetail(id),
    getSkillCategories(),
  ]);

  if (!codev) {
    notFound();
  }

  const availableSchedule = codev.work_schedules?.[0] ?? null;

  return (
    <ProfileContent
      codev={codev}
      availableSchedule={availableSchedule}
      skillCategories={skillCategories}
    />
  );
}
