import { createClientServerComponent } from "./supabase/server";


export function debounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number,
): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<F>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

// actions.ts (server action)
export const batchUpdateTasks = async (
  updates: Array<{
    taskId: string;
    newColumnId: string;
    // Add any other updatable fields
  }>,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClientServerComponent();

  try {
    const updatePromises = updates.map(async (update) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          kanban_column_id: update.newColumnId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", update.taskId);

      return error;
    });

    const errors = await Promise.all(updatePromises);
    const hasErrors = errors.some((error) => error !== null);

    return {
      success: !hasErrors,
      error: hasErrors ? "Some updates failed" : undefined,
    };
  } catch (error) {
    console.error("Batch update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Batch update failed",
    };
  }
};
