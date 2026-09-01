const OWN_WRITE_TTL_MS = 2000;
const BROADCAST_POSTGRES_SUPPRESS_MS = 4000;

const recentTaskWrites = new Map<string, number>();
const recentBroadcastApplied = new Map<string, number>();
let blockColumnPatchesUntil = 0;

function pruneExpired(entries: Map<string, number>, now: number) {
  for (const [key, expiresAt] of entries) {
    if (expiresAt <= now) {
      entries.delete(key);
    }
  }
}

export function registerOwnTaskWrite(taskId: string) {
  recentTaskWrites.set(taskId, Date.now() + OWN_WRITE_TTL_MS);
}

export function registerBroadcastApplied(taskId: string) {
  recentBroadcastApplied.set(taskId, Date.now() + BROADCAST_POSTGRES_SUPPRESS_MS);
}

export function registerColumnReorderBlock() {
  blockColumnPatchesUntil = Date.now() + OWN_WRITE_TTL_MS;
}

export function shouldIgnoreRemoteTask(taskId: string): boolean {
  const now = Date.now();
  pruneExpired(recentTaskWrites, now);
  const expiresAt = recentTaskWrites.get(taskId);
  return expiresAt !== undefined && expiresAt > now;
}

export function shouldSuppressPostgresForTask(taskId: string): boolean {
  if (shouldIgnoreRemoteTask(taskId)) {
    return true;
  }

  const now = Date.now();
  pruneExpired(recentBroadcastApplied, now);
  const expiresAt = recentBroadcastApplied.get(taskId);
  return expiresAt !== undefined && expiresAt > now;
}

export function shouldIgnoreRemoteColumnPatches(): boolean {
  return Date.now() < blockColumnPatchesUntil;
}
