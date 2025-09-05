import { useState } from "react";
import { Codev } from "@/types/home/codev";
import toast from "react-hot-toast";

import { updateCodev } from "../actions";

export function useCodevForm(initialData: Codev) {
  const [data, setData] = useState<Codev>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (key: keyof Codev, value: any) => {
    const previousValue = data[key];

    // Optimistically update the UI
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      setIsSubmitting(true);

      // Update with the server action
      await updateCodev(key, value, {
        codevId: data.id,
      });

      toast.success("Successfully updated");
    } catch (error) {
      // Revert the optimistic update on error
      setData((prev) => ({
        ...prev,
        [key]: previousValue,
      }));

      console.error("Failed to update:", error);
      toast.error("Failed to update");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Helper function to determine if a key is updatable in bulk
   */
  const isKeyUpdatable = (key: keyof Codev): boolean => {
    const allKeys = {
      projects: ["projects"],
      codev: [
        "internal_status",
        "nda_status",
        "availability_status",
        "application_status",
        "image_url",
        "email_address",
      ],
      profile: ["display_position", "role_id", "level", "tech_stacks", "email"],
    };

    return Object.values(allKeys).some((keys) => keys.includes(key as string));
  };

  /**
   * Handle multiple field updates
   */
  const handleBulkChange = async (updates: Partial<Codev>) => {
    const previousData = { ...data };
    const validUpdates = Object.entries(updates).filter(([key]) =>
      isKeyUpdatable(key as keyof Codev),
    );

    if (validUpdates.length === 0) {
      toast.error("No valid fields to update");
      return;
    }

    // Optimistically update the UI
    setData((prev) => ({
      ...prev,
      ...updates,
    }));

    try {
      setIsSubmitting(true);

      // Update each field individually
      await Promise.all(
        validUpdates.map(([key, value]) =>
          updateCodev(key as keyof Codev, value, {
            codevId: data.id,
          }),
        ),
      );

      toast.success("Successfully updated all fields");
    } catch (error) {
      // Revert all changes on error
      setData(previousData);
      console.error("Failed to update:", error);
      toast.error("Failed to update one or more fields");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    isSubmitting,
    setIsSubmitting, // <-- Expose setIsSubmitting if needed by the parent
    handleChange,
    handleBulkChange,
  };
}
