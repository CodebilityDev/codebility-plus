"use client";

import { useState } from "react";
import { useUserStore } from "@/store/codev-store";
import { ArrowBigUp } from "lucide-react";

import { AddPostUpvote, removePostUpvote } from "@/actions/feeds/post";
import type { PostType } from "@/types/feeds";

interface PostUpvoteProps {
  post: PostType;
}

export default function PostUpvote({ post }: PostUpvoteProps) {
  const userId = useUserStore((state) => state.user?.id);

  // Both seeded from the server payload, so a card issues no request on mount.
  const [isUpvoted, setIsUpvoted] = useState(post.has_upvoted ?? false);
  const [upvotes, setUpvotes] = useState(post.upvote_count ?? 0);

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
