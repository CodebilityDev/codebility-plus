import { useState } from "react";
import { Codev } from "@/types/home/codev";
import toast from "react-hot-toast";

import { updateCodev } from "../actions";

export function useCodevForm(initialData: Codev) {
  const [data, setData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (key: keyof Codev, value: any) => {
    // Optimistically update the UI
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      setIsSubmitting(true);
      await updateCodev(key, value, {
        codevId: data.id,
        userId: data.user_id,
      });

      toast.success("Successfully updated the member information");
    } catch (error) {
      // Revert the optimistic update on error
      setData((prev) => ({
        ...prev,
        [key]: initialData[key],
      }));

      toast.error("Failed to update the member information");
      console.error("Failed to update:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    isSubmitting,
    handleChange,
  };
}
