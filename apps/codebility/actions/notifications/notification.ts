import { createClientServerComponent } from "@/utils/supabase/server";
import { requireUser } from "@/lib/server/auth-guard";
import { createNotificationAction } from "./notification.actions";
import { revalidatePath } from "next/cache";

interface AssignTaskParams {
    taskId: string;
    assigneeId: string;
    taskTitle: string;
    projectId: string;
}

export async function assignTaskAction({
    taskId,
    assigneeId,
    taskTitle,
    projectId
}: AssignTaskParams) {
    // Authorize before writing. Previously the task row was updated first and
    // auth was only consulted to decide whether to send a notification, so any
    // caller could reassign any task.
    const { user } = await requireUser();

    const supabase = await createClientServerComponent();

    // 1. Update the database
    const { data: task, error: updateError } = await supabase.from("tasks").update({
        assignee_id: assigneeId,
        updated_at: new Date().toISOString()
    }).eq("id", taskId).select().single();

    if (updateError) return { data: null, error: updateError.message };

    // 2. Trigger the notification using your existing action
    // We don't "await" this if we want the UI to respond faster,
    // but awaiting is safer for error handling.

    if (user && user.id !== assigneeId) {
        const { error: notifyError } = await createNotificationAction({
            recipientId: assigneeId,
            title: "New Task Assigned",
            message: `You've been assigned to: ${taskTitle}`,
            type: "task", // matches your Notification type
            priority: "normal",
            projectId: projectId,
            actionUrl: `/dashboard/projects/${projectId}/kanban`, // Direct link to the task
            metadata: { taskId }
        });

        if (notifyError) {
            console.error("Notification failed:", notifyError);
        }
    }

    revalidatePath(`/dashboard/projects/${projectId}/kanban`);
    return { data: task, error: null };
}