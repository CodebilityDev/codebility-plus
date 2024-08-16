"use client"

import KanbanBoard from "@/app/(protectedroutes)/kanban/[id]/Kanban"
import { getBoards } from "@/app/api/kanban"
import { kanban_Kanban } from "@/types/protectedroutes"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

export default function KanbanPage({ params }: { params: { id: string } }) {
  const {
    data: Boards,
    isLoading: LoadingBoards,
    error: ErrorBoards,
  }: UseQueryResult<kanban_Kanban[], any> = useQuery({
    queryKey: ["Boards"],
    queryFn: async () => {
      return await getBoards()
    },
    refetchInterval: 3000,
  })

  if (LoadingBoards) return

  if (ErrorBoards) return

  return <KanbanBoard id={params.id} data={Boards as kanban_Kanban[]} />
}
