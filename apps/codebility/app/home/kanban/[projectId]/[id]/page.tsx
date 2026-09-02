import { notFound } from "next/navigation";



import { requireProjectMember } from "@/lib/server/auth-guard";

import { fetchUserDraftCount } from "@/lib/server/kanban-draft-query";

import { fetchBoardData } from "@/lib/server/kanban-board-query";

import { fetchProjectMembers } from "@/lib/server/project-members-query";

import { KanbanBoardProvider } from "@/store/kanban-board/KanbanBoardProvider";



import KanbanBoardPageClient from "./KanbanBoardPageClient";



interface KanbanBoardPageProps {

  params: Promise<{ id: string; projectId: string }>;

  searchParams?: Promise<{ query?: string }>;

}



export default async function KanbanBoardPage(props: KanbanBoardPageProps) {

  const { id, projectId } = await props.params;

  const searchParams = props.searchParams ? await props.searchParams : {};

  const query = searchParams?.query ?? "";



  let supabase;

  let user;

  try {

    ({ supabase, user } = await requireProjectMember(projectId));

  } catch {

    notFound();

  }



  const [boardData, members, draftCount] = await Promise.all([

    fetchBoardData(supabase, id),

    fetchProjectMembers(supabase, projectId),

    fetchUserDraftCount(supabase, projectId, user.id),

  ]);



  if (!boardData || boardData.project_id !== projectId) {

    notFound();

  }



  return (

    <KanbanBoardProvider

      boardId={id}

      projectId={projectId}

      initialBoard={boardData}

    >

      <KanbanBoardPageClient

        projectId={projectId}

        query={query}

        members={members}

        draftCount={draftCount}

      />

    </KanbanBoardProvider>

  );

}


