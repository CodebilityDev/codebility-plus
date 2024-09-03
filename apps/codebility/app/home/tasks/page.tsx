import H1 from "@/Components/shared/dashboard/H1"
import TasksContainer from "./_components/tasks-container"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import { Task } from "@/types/home/task";

export default async function TaskPage() {
/*  const {
    data: Tasks,
    isLoading: LoadingTasks,
    error: ErrorTasks,
  }: UseQueryResult<TaskT[], any> = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await getTasks()
      const tasks = response.filter((task: TaskT) => task.userTask.some((userTask) => userTask.id === userId))
      setTotalPages(Math.ceil(tasks.length / PAGE_SIZE))
      return tasks
    },
    refetchInterval: 3000,
  })
 */

  const supabase = getSupabaseServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase.from("codev")
  .select(`
    codev_task(
      *,
      task(
        *,
        project(
          name
        )
      )
    )
  `)
  .eq("user_id", user?.id)
  .single();

  let tasks: Task[] = [];
  
  if (data?.codev_task && data.codev_task.length > 0) { 
    // get only the task data of codev.
    tasks = data.codev_task.map(codevTask => codevTask.task);
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>My Tasks</H1>
      </div>
      <TasksContainer tasks={tasks} />
    </div>
  )
}