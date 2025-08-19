"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createNewSprint(formData: FormData) {
  const supabase = await createClientServerComponent();

	const projectId = formData.get("projectId") as string;
	const sprintStartAt = formData.get("sprint.startAt") as string;
	const sprintEndAt = formData.get("sprint.endAt") as string;

	const boardName = formData.get("board.name") as string;
	const boardDescription = formData.get("board.description") as string;

	if (!projectId || !sprintStartAt || !sprintEndAt || !boardName) {
		return { success: false, error: "Missing required fields" };
	}

	try {
		// Fetch the current sprint count for the project
		const { count, error: countError } = await supabase
			.from("kanban_sprints")
			.select("*", { count: "exact", head: true })
			.eq("project_id", projectId);

		if (countError) {
			console.error("Error fetching sprint count:", countError);
			return { success: false, error: "Failed to generate sprint name" };
		}

    // Insert the new board
		const board = await supabase
			.from("kanban_boards")
			.insert({
				name: boardName,
				description: boardDescription,
				project_id: projectId,
			})
			.select()
			.single();

		if (board.error) {
			console.error("Error creating board:", board.error);
			return { success: false, error: "Failed to create board" };
		}

		let sprint;
		if (board.data) {
		  // Generate sprint name (e.g., Sprint 1, Sprint 2, etc.)
		  const sprintName = `Sprint ${count! + 1}`;

			// Insert the new sprint
			sprint = await supabase
				.from("kanban_sprints")
				.insert({
					board_id: board.data.id,
					project_id: projectId,
					name: sprintName,
					start_at: sprintStartAt,
					end_at: sprintEndAt,
				})
				.select()
				.single();
		}

		if (sprint?.error) {
			console.error("Error creating sprint:", sprint.error);
			return { success: false, error: sprint.error.message };
		}

		// Revalidate the KanbanSprintPage to refresh the sprints list
		revalidatePath(`/kanban/${projectId}`);

		return {
			success: true,
			data: {
				...sprint,
				board: board,
			},
		};
	} catch (error) {
		console.error("Unexpected error:", error);
		return { success: false, error: "Failed to create sprint" };
	}
}
