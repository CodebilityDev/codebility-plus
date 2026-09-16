import OverflowView from "./_components/OverflowView";
import { createClientServerComponent } from "@/utils/supabase/server";
import {
  fetchQuestions,
  fetchTrendingTopics,
  getSocialPoints,
  getUserLikedPosts,
} from "@/actions/overflow/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OverflowPage() {
  const supabase = await createClientServerComponent();

  // Get current user
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: user, error: userError } = await supabase
    .from("codev")
    .select("*")
    .eq("id", authUser?.id)
    .single();

  const codevData = {
    ...user
  };

  // First page of questions, trending topics and social points were three
  // mount-time effects in OverflowView; resolving them here removes the
  // post-hydration round trips. Pagination and post-question refresh still
  // re-fetch on the client. Liked post ids are fetched once here so each
  // QuestionCard does not issue its own `checkPostLike` call.
  const [questionsResult, trendingTopics, socialPoints, liked] =
    await Promise.all([
      fetchQuestions(1, 5),
      fetchTrendingTopics(),
      user?.id ? getSocialPoints(user.id) : Promise.resolve(0),
      user?.id
        ? getUserLikedPosts(user.id)
        : Promise.resolve({ success: true, likedPostIds: [] as string[] }),
    ]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 text-center">
          <div className="mb-4">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
              Codev Overflow
            </h1>
            <div className="mx-auto mt-4 h-px w-full bg-gradient-to-r from-transparent via-customBlue-400 to-transparent"></div>
          </div>
          <p className="mx-auto max-w-2xl text-lg font-light text-gray-600 dark:text-gray-300">
            A community-driven platform where developers collaborate, share knowledge, and solve problems together
          </p>
        </div>

        <div className="relative">
          <OverflowView
            author={codevData}
            initialQuestions={questionsResult}
            initialTrendingTopics={trendingTopics}
            initialSocialPoints={socialPoints ?? 0}
            initialLikedPostIds={liked.likedPostIds}
          />
        </div>
      </div>
    </div>
  );
}
