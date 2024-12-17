import H1 from "@/Components/shared/dashboard/H1";
import { getCachedUser } from "@/lib/server/supabase-server-comp";
import { Task } from "@/types/home/task";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import TasksContainer from "./_components/tasks-container";

export default async function TaskPage() {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCachedUser();
  const { data } = await supabase
    .from("codev")
    .select(
      `
    codev_task(
      *,
      task(
        *,
        project(
          name
        ),
        codev_task(
          codev(
            user(
              profile(*)
            )
          )
        )
      )
    )
  `,
    )
    .eq("user_id", user?.id)
    .single();

  let tasks: Task[] = [];

  if (data?.codev_task && data.codev_task.length > 0) {
    // get only the task data of codev.
    tasks = data.codev_task.map((codevTask) => codevTask.task);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-screen-xl flex-col gap-4">
      <div className="flex justify-between gap-4">
        <H1>My Tasks</H1>
      </div>
      <TasksContainer tasks={tasks} />
    </div>
  );
}
