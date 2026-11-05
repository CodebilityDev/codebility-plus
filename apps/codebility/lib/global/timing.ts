const enabled =
  process.env.PERF_LOG === "1" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NODE_ENV === "development";

export function logPerf(label: string, startedAt: number): void {
  if (!enabled) return;

  console.log(`[perf] ${label} ${Math.round(performance.now() - startedAt)}ms`);
}
