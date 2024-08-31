import { z } from "zod";

export const KanbanListSchema = z.object({
    name: z.string()
});
