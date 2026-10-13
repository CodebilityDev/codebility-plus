export const PROFILE_POINTS_ERROR =
  "Failed to load profile completion data";

export function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
