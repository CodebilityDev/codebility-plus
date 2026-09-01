"use server";

import { fetchBoardDataFromDb } from "@/lib/server/kanban-board-query";

export const getBoardData = async (boardId: string) => {
  return fetchBoardDataFromDb(boardId);
};
