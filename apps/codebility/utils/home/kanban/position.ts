export const POSITION_GAP = 1000;

interface PositionPlan {
  position: number;
  renumber: boolean;
}

export function resolvePosition(
  prev: number | null,
  next: number | null,
): PositionPlan {
  if (prev !== null && next !== null) {
    return next > prev
      ? { position: (prev + next) / 2, renumber: false }
      : { position: 0, renumber: true };
  }
  if (prev !== null) return { position: prev + POSITION_GAP, renumber: false };
  if (next !== null) return { position: next - POSITION_GAP, renumber: false };
  return { position: POSITION_GAP, renumber: false };
}

export function assignPositions(
  orderedIds: string[],
): { id: string; position: number }[] {
  return orderedIds.map((id, index) => ({
    id,
    position: (index + 1) * POSITION_GAP,
  }));
}

export function resolveIndex(
  ids: string[],
  beforeTaskId: string | null,
  afterTaskId: string | null,
): number {
  const afterIndex = afterTaskId ? ids.indexOf(afterTaskId) : -1;

  if (afterIndex >= 0) return afterIndex;

  const beforeIndex = beforeTaskId ? ids.indexOf(beforeTaskId) : -1;

  return beforeIndex >= 0 ? beforeIndex + 1 : ids.length;
}
