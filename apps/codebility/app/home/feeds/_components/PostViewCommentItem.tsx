"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFeedsStore } from "@/store/feeds-store";
import { X } from "lucide-react";
import { deletePostComment } from "../_services/action";

interface PostViewCommentItemProps {
  postId: string;
  commenntId: string;
  userImage: string;
  userName: string;
  content: string;
  userCanDelete: boolean;
  mentions?: Array<{ username: string }>;
}

export default function PostViewCommentItem({
  postId,
  commenntId,
  userImage,
  userName,
  content,
  userCanDelete,
  mentions = [],
}: PostViewCommentItemProps) {
  const router = useRouter();
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);
  const [isVisible, setIsVisible] = useState(true);

  const handleDelete = async () => {
    setIsVisible(false);
    try {
      await deletePostComment(commenntId);
      // Get current post from store
      const currentPost = useFeedsStore
        .getState()
        .posts.find((p) => p.id === postId);
      if (currentPost) {
        useFeedsStore.getState().updatePost(postId, {
          comment_count: (currentPost.comment_count ?? 0) - 1,
        });
      }
    } catch (error) {
      setIsVisible(true);
    }
  };

  // Function to highlight mentions in comment text
  const renderContentWithMentions = (text: string) => {
    // Split by @username pattern
    const parts = text.split(/(@\w+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1);
        // Check if this username is in the mentions array
        const isMentioned = mentions.some((m) => m.username === username);

        if (isMentioned) {
          return (
            <span
              key={index}
              className="font-medium text-blue-600 hover:underline cursor-pointer dark:text-blue-400"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                // Navigate to user profile using Next.js router
                router.push(`/profile/${username}`);
              }}
            >
              {part}
            </span>
          );
        }
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      id={`comment-${commenntId}`} 
      className="group relative flex items-start gap-3 rounded-md p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
    >
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
      <div className="flex flex-col flex-1">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {userName}
        </span>
        <p className="break-words text-sm text-gray-700 dark:text-gray-300">
          {renderContentWithMentions(content)}
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