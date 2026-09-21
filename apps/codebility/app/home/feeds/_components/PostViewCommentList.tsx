"use client";
import { useQuery } from "@tanstack/react-query";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { getPostComments } from "@/actions/feeds/post";
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
  const user = useUserStore((state) => state.user);
  const currentUserId = user?.id ?? null;

  const { data: comments = [], isPending: loading } = useQuery({
    queryKey: ["feeds", "comments", postId, refresh],
    queryFn: async (): Promise<Comment[]> => {
      const data = await getPostComments(postId);

      return (data || []).map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        commenter: Array.isArray(comment.commenter)
          ? comment.commenter[0]
          : comment.commenter,
        mentions: comment.mentions || [],
      }));
    },
  });

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
        const userImage = c.commenter?.image_url || defaultAvatar;
        return (
          <PostViewCommentItem
            key={c.id}
            postId={postId}
            commenntId={c.id}
            userImage={typeof userImage === "string" ? userImage : userImage.src}
            userName={`${c.commenter?.first_name} ${c.commenter?.last_name}`}
            content={c.content}
            userCanDelete={
              currentUserId === c.commenter?.id || hasDeleteCommentPrivilege
            }
            mentions={c.mentions || []}
          />
        );
      })}
    </div>
  );
}