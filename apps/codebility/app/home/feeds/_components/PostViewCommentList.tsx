"use client";

import { useEffect, useState } from "react";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";

import { getPostComments } from "../_services/action";
import PostViewCommentItem from "./PostViewCommentItem";

interface PostViewCommentListProps {
  postId: string;
  refresh: number;
  hasDeleteCommentPrivilege: boolean;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  commenter: any;
}

export default function PostViewCommentList({
  postId,
  refresh,
  hasDeleteCommentPrivilege,
}: PostViewCommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getPostComments(postId);
        setComments(data || []); // Add fallback to empty array
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, refresh]);

  if (loading) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Loading comments…
      </p>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {comments.map((c) => (
        <PostViewCommentItem
          key={c.id}
          postId={postId}
          commenntId={c.id}
          userImage={c.commenter?.image_url || defaultAvatar}
          userName={`${c.commenter?.first_name} ${c.commenter?.last_name}`}
          content={c.content}
          userCanDelete={
            user?.id === c.commenter?.id || hasDeleteCommentPrivilege
          }
        />
      ))}
    </div>
  );
}