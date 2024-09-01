import { taskPrioLevels, taskTypes } from "@/constants";
import { z } from "zod";

export const KanbanTaskSchema = z.object({
    title: z.string().min(1),
    category: z.string().min(1),
    duration: z.number(),
    priority: z.enum(taskPrioLevels),
    type: z.enum(taskTypes),
    points: z.number(),
    members: z.array(z.string()),
    description: z.string().min(1),
});
