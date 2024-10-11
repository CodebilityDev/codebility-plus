import H1 from "@/Components/shared/dashboard/H1";
import { Task } from "@/types/home/task";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import TasksContainer from "./_components/tasks-container";

export default async function TaskPage() {
  const supabase = getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
    <div className="max-w-screen-xl mx-auto flex min-h-[70vh] flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>My Tasks</H1>
      </div>
      <TasksContainer tasks={tasks} />
    </div>
  );
}
