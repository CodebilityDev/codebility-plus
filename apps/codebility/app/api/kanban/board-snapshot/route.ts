import { NextResponse } from "next/server";

import type { BoardSnapshotInput } from "@/lib/kanban/board-snapshot-types";
import { persistBoardSnapshot } from "@/lib/server/kanban-board-snapshot-sync";

export async function POST(request: Request) {
  let snapshot: BoardSnapshotInput;

  try {
    snapshot = (await request.json()) as BoardSnapshotInput;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!snapshot?.boardId || !snapshot?.projectId) {
    return NextResponse.json(
      { success: false, error: "Missing boardId or projectId" },
      { status: 400 },
    );
  }

  const result = await persistBoardSnapshot(snapshot);

  if (!result.success) {
    const status = result.error === "Unauthorized" ? 401 : result.error === "Forbidden" ? 403 : 500;
    return NextResponse.json(result, { status });
  }

  return NextResponse.json(result);
}
