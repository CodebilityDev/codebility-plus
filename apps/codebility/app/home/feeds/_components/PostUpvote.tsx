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
} from "../_services/action";
import { PostType } from "../_services/query";

interface PostUpvoteProps {
  post: PostType;
}

export default function PostUpvote({ post }: PostUpvoteProps) {
  const { user } = useUserStore();

  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const { posts, fetchPosts } = useFeedsStore((state) => ({
    posts: state.posts,
    fetchPosts: state.fetchPosts,
  }));

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

      if (post?.id) {
        try {
          const upvotesCount = await countUpvotes(post.id);
          setUpvotes(upvotesCount);
        } catch (error) {
          console.error("Error counting upvotes:", error);
        }
      }
    };
    checkUpvote();
  }, [user?.id, post?.id, posts]);

  const handleUpvote = async (e: React.MouseEvent) => {
    if (user) {
      e.stopPropagation();
      e.preventDefault();

      setIsUpvoted((prev) => !prev);
      setUpvotes((prev) => prev + (isUpvoted ? -1 : 1));

      if (!isUpvoted) {
        const postUpvote = await AddPostUpvote(post.id, user.id);
      } else {
        removePostUpvote(post.id, user.id);
      }

      await fetchPosts();
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
