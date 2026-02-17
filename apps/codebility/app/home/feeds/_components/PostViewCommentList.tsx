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
  commenter: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string | null;
  };
  mentions: Array<{
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    image_url: string | null;
    headline?: string | null;
  }>;
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
        console.log("Fetching comments for post:", postId);
        const data = await getPostComments(postId);
        console.log("Fetched comments:", data);
        
        // Transform the data to ensure correct structure
        const transformedComments = (data || []).map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          commenter: Array.isArray(comment.commenter) 
            ? comment.commenter[0] 
            : comment.commenter,
          mentions: comment.mentions || [],
        }));
        
        setComments(transformedComments);
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
      {comments.map((c) => {
        console.log("Rendering comment:", c.id, "with mentions:", c.mentions);
        const userImage = c.commenter?.image_url || defaultAvatar;
        return (
          <PostViewCommentItem
            key={c.id}
            postId={postId}
            commenntId={c.id}
            userImage={typeof userImage === 'string' ? userImage : userImage.src}
            userName={`${c.commenter?.first_name} ${c.commenter?.last_name}`}
            content={c.content}
            userCanDelete={
              user?.id === c.commenter?.id || hasDeleteCommentPrivilege
            }
            mentions={c.mentions || []}
          />
        );
      })}
    </div>
  );
}