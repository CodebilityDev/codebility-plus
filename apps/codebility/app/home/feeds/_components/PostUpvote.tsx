"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { ArrowBigUp } from "lucide-react";

import {
  AddPostUpvote,
  countUpvotes,
  hasUserUpvoted,
  removePostUpvote,
} from "@/actions/feeds/post";
import type { PostType } from "@/types/feeds";

interface PostUpvoteProps {
  post: PostType;
}

export default function PostUpvote({ post }: PostUpvoteProps) {
  const userId = useUserStore((state) => state.user?.id);

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);

  // `posts` was in this dependency list, so every feed write (and every unrelated
  // store update) re-ran both server actions for every visible card. Depend on
  // the post's own id only; the counts are refetched by handleUpvote.
  useEffect(() => {
    let cancelled = false;

    const checkUpvote = async () => {
      if (userId && post?.id) {
        try {
          const result = await hasUserUpvoted(post.id, userId);
          if (!cancelled) setIsUpvoted(result);
        } catch (error) {
          console.error("Error checking upvote status:", error);
          if (!cancelled) setIsUpvoted(false);
        }
      } else {
        setIsUpvoted(false);
      }

      if (post?.id) {
        try {
          const upvotesCount = await countUpvotes(post.id);
          if (!cancelled) setUpvotes(upvotesCount);
        } catch (error) {
          console.error("Error counting upvotes:", error);
        }
      }
    };

    checkUpvote();

    return () => {
      cancelled = true;
    };
  }, [userId, post?.id]);

  const handleUpvote = async (e: React.MouseEvent) => {
    if (userId) {
      e.stopPropagation();
      e.preventDefault();

      setIsUpvoted((prev) => !prev);
      setUpvotes((prev) => prev + (isUpvoted ? -1 : 1));

      if (!isUpvoted) {
        await AddPostUpvote(post.id, userId);

        useFeedsStore.getState().updatePost(post.id, {
          upvote_count: post.comment_count! + 1,
        });
      } else {
        await removePostUpvote(post.id, userId);

        useFeedsStore.getState().updatePost(post.id, {
          upvote_count: post.comment_count! - 1,
        });
      }
    }
  };

  return (
    <button
      className={`flex items-center space-x-1 ${
        isUpvoted
          ? "text-customBlue-300 dark:text-customBlue-200"
          : "hover:text-customBlue-300 dark:hover:text-customBlue-200"
      }`}
      onClick={handleUpvote}
    >
      {isUpvoted ? <ArrowBigUp fill="currentColor" /> : <ArrowBigUp />}
      <span>{upvotes}</span>
    </button>
  );
}
