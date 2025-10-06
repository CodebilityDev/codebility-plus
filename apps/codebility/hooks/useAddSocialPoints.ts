"use client";

import { createClientClientComponent } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";

export function useAddSocialPoints() {
  const [supabase, setSupabase] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  const addSocialPoints = useCallback(
    async (codevId: string | undefined, categoryId: string) => {
      if (!supabase) return null;

      try {
        setLoading(true);
        setError(null);

        // Fetch category to get its points
        const { data: category, error: categoryError } = await supabase
          .from("social_points_categories")
          .select("*")
          .eq("id", categoryId)
          .single();

        if (categoryError) throw categoryError;
        if (!category) throw new Error("Category not found");

        // Insert social points entry
        const { data: socialPoints, error: insertError } = await supabase
          .from("social_points")
          .insert([
            {
              codev_id: codevId,
              category_id: categoryId,
              points: category.points,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        return socialPoints;
      } catch (err: any) {
        console.error("Error adding social points:", err);
        setError(err.message || "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return { addSocialPoints, loading, error };
}
