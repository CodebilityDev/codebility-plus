"use client";

import { useEffect, useState } from "react";
import { useAddSocialPoints } from "@/hooks/useAddSocialPoints";
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
  const { addSocialPoints } = useAddSocialPoints();

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

  const handleUpvote = async (e: React.MouseEvent) => {
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

      //Add social points to author
      await addSocialPoints(post?.author_id?.id, "2");
    }
  };

  return (
    <button
      className={`flex items-center space-x-1 ${
        isUpvoted
          ? "text-customBlue-500 dark:text-customBlue-400"
          : "hover:text-customBlue-500 dark:hover:text-customBlue-400"
      }`}
      onClick={handleUpvote}
    >
      {isUpvoted ? <ArrowBigUp fill="currentColor" /> : <ArrowBigUp />}
      <span>{upvotes}</span>
    </button>
  );
}
