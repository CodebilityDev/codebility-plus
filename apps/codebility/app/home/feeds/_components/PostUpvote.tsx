"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/codev-store";
import { ArrowBigUp } from "lucide-react";

import {
  AddPostUpvote,
  hasUserUpvoted,
  removePostUpvote,
} from "../_services/action";
import { PostType } from "../_services/query";

interface PostUpvoteProps {
  post: PostType;
}

export default function PostUpvote({ post }: PostUpvoteProps) {
  const { user } = useUserStore();

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(post.upvoters_id?.length || 0);

  useEffect(() => {
    const checkUpvote = async () => {
      if (user?.id && post?.id) {
        try {
          const result = await hasUserUpvoted(post.id, user.id);
          setIsUpvoted(result);
        } catch (error) {
          console.error("Error checking upvote status:", error);
          setIsUpvoted(false);
        }
      } else {
        setIsUpvoted(false);
      }
    };

    checkUpvote();
  }, [user?.id, post?.id]);

  const handleUpvote = (e: React.MouseEvent) => {
    if (user) {
      e.stopPropagation();
      e.preventDefault();

      if (!isUpvoted) {
        AddPostUpvote(post.id, user.id);
      } else {
        removePostUpvote(post.id, user.id);
      }

      setIsUpvoted((prev) => !prev);
      setUpvotes((prev) => prev + (isUpvoted ? -1 : 1));
    }
  };

  return (
    <button
      className={`flex items-center space-x-1 ${
        isUpvoted
          ? "text-blue-500 dark:text-blue-400"
          : "hover:text-blue-500 dark:hover:text-blue-400"
      }`}
      onClick={handleUpvote}
    >
      {isUpvoted ? <ArrowBigUp fill="currentColor" /> : <ArrowBigUp />}
      <span>{upvotes}</span>
    </button>
  );
}
