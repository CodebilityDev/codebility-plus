"use server";

import { getTasksPage, type TaskPageRow } from "@/lib/server/task.service";
import type { Page, PageArgs } from "@/lib/server/paginate";

export const fetchTasksPageAction = async (
  args: PageArgs & { codevId: string },
): Promise<Page<TaskPageRow>> => getTasksPage(args);
