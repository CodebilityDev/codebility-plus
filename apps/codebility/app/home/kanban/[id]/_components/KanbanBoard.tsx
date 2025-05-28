"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import pathsConfig from "@/config/paths.config";
import { ArrowRightIcon, IconSearch } from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
import { KanbanBoardType, KanbanColumnType } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

import KanbanBoardsSearch from "../../_components/KanbanBoardsSearch";
import KanbanAddMembersButton from "./kanban_modals/KanbanAddMembersButton";
import KanbanColumnAddButton from "./kanban_modals/KanbanColumnAddButton";
import KanbanColumnAddModal from "./kanban_modals/KanbanColumnAddModal";
import KanbanBoardColumnContainer from "./KanbanBoardColumnContainer";
import UserTaskFilter from "./UserTaskFilter";

interface KanbanBoardProps {
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] };
}

export default function KanbanBoard({ boardData }: KanbanBoardProps) {
  const user = useUserStore((state) => state.user);
  const canAddColumn = user?.role_id === 1 || user?.role_id === 5;
  const canAddMember = canAddColumn;
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [members, setMembers] = useState<
    Array<{
      userId: string;
      userName: string;
      imageUrl?: string | null;
      isActive: boolean;
    }>
  >([]);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchMembers = async () => {
      const uniqueUsers = new Set<string>();

      boardData.kanban_columns.forEach((column) => {
        column.tasks?.forEach((task) => {
          if (task.codev?.id) {
            uniqueUsers.add(task.codev.id);
          }
          task.sidekick_ids?.forEach((id) => uniqueUsers.add(id));
        });
      });

      if (uniqueUsers.size > 0) {
        const { data, error } = await supabase
          .from("codev")
          .select("id, first_name, last_name, image_url")
          .in("id", Array.from(uniqueUsers));

        if (!error && data) {
          const membersList = data.map((user) => ({
            userId: user.id,
            userName: `${user.first_name} ${user.last_name}`,
            imageUrl: user.image_url,
            isActive: activeFilter === user.id,
          }));
          setMembers(membersList);
        }
      }
    };

    fetchMembers();
  }, [boardData, activeFilter, supabase]);

  const handleFilterClick = (userId: string) => {
    setActiveFilter(activeFilter === userId ? null : userId);
  };

  if (!boardData) {
    return (
      <div className="text-center text-red-500">Board data not found.</div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col">
        <div className="text-dark100_light900 flex h-full flex-col gap-4 ">
          <div className="flex flex-row items-center gap-4 text-sm">
            <Link href={pathsConfig.app.kanban}>
              <span className="dark:text-white/50">Kanban Board</span>
            </Link>
            <ArrowRightIcon />
            <span className="font-semibold">{boardData.name}</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <h1 className="text-dark100_light900 text-md font-semibold md:text-2xl">
              {boardData.name}
            </h1>

            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex items-center gap-6">
                {/* Added fixed height and overflow visible */}
                <div className="h-10 overflow-visible">
                  <UserTaskFilter
                    members={members}
                    onFilterClick={handleFilterClick}
                  />
                </div>

                <div className="bg-light-900 flex w-[280px] items-center gap-3 rounded-md border border-zinc-300 p-2 dark:border-zinc-500 dark:bg-[#2C303A]">
                  <label htmlFor="kanbanSearch">
                    <IconSearch />
                  </label>
                  <KanbanBoardsSearch
                    className="w-full bg-transparent outline-none"
                    placeholder="Search"
                    id="kanbanSearch"
                  />
                </div>
              </div>
              {canAddColumn && <KanbanColumnAddButton boardId={boardData.id} />}
              {canAddMember && <KanbanAddMembersButton />}
            </div>
          </div>

          <div className="text-dark100_light900 flex h-full">
            <KanbanBoardColumnContainer
              projectId={boardData.id}
              columns={boardData.kanban_columns || []}
              activeFilter={activeFilter}
            />
          </div>
        </div>
      </div>

      {canAddColumn && <KanbanColumnAddModal />}
    </div>
  );
}
