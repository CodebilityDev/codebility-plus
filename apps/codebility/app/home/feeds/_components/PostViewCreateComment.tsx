"use client";

import { useState } from "react";
import Image from "next/image";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";

import { createComment } from "../_services/action";

interface CreateCommentProps {
  postId: string;
  onCommentCreated?: () => void;
}

export default function PostViewCreateComment({
  postId,
  onCommentCreated,
}: CreateCommentProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);
  const { user } = useUserStore();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && comment.trim() && !isSubmitting) {
      if (!user || !user.id) return;
      try {
        setIsSubmitting(true);
        await createComment(postId, user.id, comment);
        setComment("");
        onCommentCreated?.();
        fetchPosts();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-3 p-2">
      <Image
        src={user?.image_url || defaultAvatar}
        alt="User avatar"
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
      <input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSubmitting}
        className={`flex-1 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white ${
          isSubmitting
            ? "cursor-not-allowed opacity-50"
            : "focus:border-gray-500"
        }`}
      />
    </div>
  );
}
