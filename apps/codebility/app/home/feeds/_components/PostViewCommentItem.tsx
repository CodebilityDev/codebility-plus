"use client";

import { useState } from "react";
import Image from "next/image";
import { useFeedsStore } from "@/store/feeds-store";
import { X } from "lucide-react";

import { deletePostComment } from "../_services/action";

interface PostViewCommentItemProps {
  commenntId: string;
  userImage: string;
  userName: string;
  content: string;
  userCanDelete: boolean;
}

export default function PostViewCommentItem({
  commenntId,
  userImage,
  userName,
  content,
  userCanDelete,
}: PostViewCommentItemProps) {
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);
  const [isVisible, setIsVisible] = useState(true);

  const handleDelete = async () => {
    setIsVisible(false);
    try {
      await deletePostComment(commenntId);
      fetchPosts();
    } catch (error) {
      setIsVisible(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="group relative flex items-start gap-3 rounded-md p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/40">
      {/* Avatar */}
      <Image
        src={
          userImage ||
          "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
        }
        alt={`${userName}'s avatar`}
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />

      {/* User content */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {userName}
        </span>
        <p className="break-words text-sm text-gray-700 dark:text-gray-300">
          {content}
        </p>
      </div>

      {/* X Icon (only visible on hover) */}
      {userCanDelete && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-2 rounded-full p-1 opacity-0 transition-opacity hover:bg-gray-200 group-hover:opacity-100 dark:hover:bg-gray-700"
          aria-label="Delete comment"
        >
          <X size={16} className="text-gray-600 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
}
