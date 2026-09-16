"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/codev-store";
import { ArrowBigUp } from "lucide-react";

import {
  AddPostUpvote,
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
  // Seeded from the server payload (`getPosts` computes upvote_count), so no
  // per-card countUpvotes round trip is needed on mount.
  const [upvotes, setUpvotes] = useState(post.upvote_count ?? 0);

  // Only the viewer's own upvote state is per-user and absent from the payload,
  // so it is the one thing still fetched. Depends on primitives only.
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
      } else {
        await removePostUpvote(post.id, userId);
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
