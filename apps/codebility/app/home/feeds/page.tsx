import { getCurrentCodev } from "@/lib/server/current-codev";
import { getUserRole, hasNotPostedYet, getSocialPoints } from "@/actions/feeds/post";
import { getPosts } from "@/actions/feeds/queries";

import FeedsPageClient from "./_components/FeedsPageClient";

export default async function FeedsPage() {
  const user = await getCurrentCodev();

  // Resolved here rather than in client mount effects: these were the page's
  // data-fetching effects and each cost a server-action round trip after
  // hydration. The feed list is seeded the same way so the client never fetches
  // posts on mount.
  const [role, notPostedYet, socialPoints, posts] = await Promise.all([
    user ? getUserRole(user.role_id ?? null) : Promise.resolve(null),
    user ? hasNotPostedYet() : Promise.resolve(false),
    user ? getSocialPoints(user.id) : Promise.resolve(null),
    getPosts(),
  ]);

  return (
    <FeedsPageClient
      user={user}
      isAdmin={role === "Admin"}
      userHasNotPostedYet={notPostedYet}
      socialPoints={socialPoints}
      initialPosts={posts ?? []}
    />
  );
}
