import { KanbanColumnType } from "@/types/home/codev";

export type ColumnLoadMeta = {
  loadedCount: number;
  totalCount: number;
};

export function buildColumnLoadMeta(
  columns: KanbanColumnType[],
): Record<string, ColumnLoadMeta> {
  return Object.fromEntries(
    columns.map((column) => {
      const count = column.tasks?.length ?? 0;
      return [column.id, { loadedCount: count, totalCount: count }];
    }),
  );
}

export function isBoardFullyLoaded(
  columnLoadMeta: Record<string, ColumnLoadMeta>,
): boolean {
  const entries = Object.values(columnLoadMeta);
  if (entries.length === 0) {
    return true;
  }

  return entries.every((meta) => meta.loadedCount >= meta.totalCount);
}

export function adjustColumnTotalCount(
  columnLoadMeta: Record<string, ColumnLoadMeta>,
  columnId: string,
  delta: number,
): Record<string, ColumnLoadMeta> {
  const existing = columnLoadMeta[columnId];

  if (!existing) {
    if (delta <= 0) {
      return columnLoadMeta;
    }

    return {
      ...columnLoadMeta,
      [columnId]: { loadedCount: delta, totalCount: delta },
    };
  }

  return {
    ...columnLoadMeta,
    [columnId]: {
      ...existing,
      totalCount: Math.max(0, existing.totalCount + delta),
    },
  };
}
