"use client";



import { useMemo } from "react";



import type { SimpleMemberData } from "@/actions/projects/actions";

import { filterBoardByQuery } from "@/lib/kanban/board-mappers";

import {

  useKanbanBoardMeta,

  useKanbanColumns,

} from "@/store/kanban-board/KanbanBoardProvider";



import KanbanBoard from "./_components/KanbanBoard";



type KanbanBoardPageClientProps = {

  projectId: string;

  query?: string;

  members: SimpleMemberData[];

  draftCount: number;

};



export default function KanbanBoardPageClient({

  projectId,

  query = "",

  members,

  draftCount,

}: KanbanBoardPageClientProps) {

  const columns = useKanbanColumns();

  const { board } = useKanbanBoardMeta();



  const boardData = useMemo(() => {

    const withColumns = { ...board, kanban_columns: columns };

    return filterBoardByQuery(withColumns, query);

  }, [board, columns, query]);



  return (

    <div className="w-full">

      <div className="flex flex-col gap-4 pt-4">

        <KanbanBoard

          projectId={projectId}

          boardData={boardData}

          members={members}

          draftCount={draftCount}

        />

      </div>

    </div>

  );

}


