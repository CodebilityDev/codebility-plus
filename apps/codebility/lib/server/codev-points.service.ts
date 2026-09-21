import "server-only";

import { cache } from "react";
import { createClientServerComponent } from "@/utils/supabase/server";

export type PointsSummary = {
  skillPoints: Record<string, number>;
  attendancePoints: number;
  totalPoints: number;
};

/**
 * Read-only skill + attendance totals for one codev.
 *
 * Deliberately not `computeProfilePoints`/`persistProfilePoints`: those score
 * profile *completeness* and write on read, which is a different number from the
 * skill points the certificate awards. This is the same sum the certificate
 * preview used to run in the browser.
 */
export const getCodevPointsSummary = cache(
  async (codevId: string): Promise<PointsSummary> => {
    if (!codevId) return { skillPoints: {}, attendancePoints: 0, totalPoints: 0 };

    const supabase = await createClientServerComponent();

    const [{ data: codevPoints }, { data: attendance }] = await Promise.all([
      supabase
        .from("codev_points")
        .select("points, skill_category_id")
        .eq("codev_id", codevId),
      supabase
        .from("attendance_points")
        .select("points")
        .eq("codev_id", codevId)
        .maybeSingle(),
    ]);

    const skillPoints: Record<string, number> = {};
    codevPoints?.forEach((cp) => {
      if (cp.skill_category_id) skillPoints[cp.skill_category_id] = cp.points;
    });

    const attendancePoints = attendance?.points ?? 0;
    const skillTotal = codevPoints?.reduce((acc, cp) => acc + (cp.points || 0), 0) ?? 0;

    return { skillPoints, attendancePoints, totalPoints: skillTotal + attendancePoints };
  },
);
