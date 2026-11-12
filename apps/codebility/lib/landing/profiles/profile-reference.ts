import { cacheLife } from "next/cache";

export async function getProfileReferenceDate() {
  "use cache";
  cacheLife("hours");
  await Promise.resolve();
  return new Date().toISOString();
}
