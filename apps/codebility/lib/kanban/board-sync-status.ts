let activeFlushCount = 0;
const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function beginBoardSnapshotSync() {
  activeFlushCount += 1;
  notifyListeners();
}

export function endBoardSnapshotSync() {
  activeFlushCount = Math.max(0, activeFlushCount - 1);
  notifyListeners();
}

export function getIsBoardSnapshotSyncing(): boolean {
  return activeFlushCount > 0;
}

export function subscribeBoardSnapshotSync(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
