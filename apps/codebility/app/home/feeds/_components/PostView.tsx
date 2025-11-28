"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import EditPostModal from "@/components/modals/EditPostModal";
import { Box } from "@/components/shared/dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { PostType } from "../_services/query";
import PostUpvote from "../_components/PostUpvote";
import { getUserRole } from "../_services/action";
import PostCommentCount from "./PostCommentCount";
import PostTags from "./PostTags";
import PostViewCommentList from "./PostViewCommentList";
import PostViewCreateComment from "./PostViewCreateComment";

interface PostViewProps {
  postId: string;
}

export default function PostView({ postId }: PostViewProps) {
  const [post, setPost] = useState<PostType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);
  const { user } = useUserStore();
  const [refreshComments, setRefreshComments] = useState(0);

  const { posts } = useFeedsStore();

  // Trigger comment refresh
  const triggerRefreshComments = () => {
    setRefreshComments((prev) => prev + 1);
  };

  // Find the post in the store
  useEffect(() => {
    const foundPost = posts.find((p) => p.id === postId) || null;
    setPost(foundPost);
  }, [posts, postId]);

  // Check roles
  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const role = await getUserRole(user.role_id ?? null);
      setIsAdmin(role === "Admin");
    };

    const checkIfAuthor = () => {
      if (!user) return;
      setIsAuthor(user.id === post?.author_id?.id);
    };

    if (user) {
      fetchRole();
      checkIfAuthor();
    }
  }, [user, post]);

  if (!post) {
    return (
      <div className="mx-auto flex w-full max-w-[50rem] flex-col gap-4">
        <Box className="mx-auto w-full rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
          <Skeleton className="h-40 w-full rounded-lg" />
        </Box>
      </div>
    );
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="flex items-center">
        <Image
          src={post.author_id?.image_url || defaultAvatar}
          alt={`${post.author_id?.first_name || "User"}'s profile`}
          className="mr-4 h-10 w-10 rounded-full object-cover"
          width={40}
          height={40}
        />
        <div className="flex-1">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">
            {post.author_id
              ? `${post.author_id.first_name} ${post.author_id.last_name}`
              : "Codebility"}
          </h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {format(new Date(post.created_at), "MMM d, yyyy")}
        </p>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <PostUpvote post={post} />
        <PostCommentCount post={post} />
      </div>

      <PostTags post={post} />

      <div className="max-h-[90vh] overflow-y-auto">
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {`![Post image](${post.image_url || "/assets/images/bg-certificate.png"})\n\n${post.content}`}
          </ReactMarkdown>
        </div>

        {(isAdmin || isAuthor) && (
          <Button className="mb-4 mt-4 w-auto" onClick={openModal}>
            Edit Post
          </Button>
        )}

        <div className="mb-1 mt-1 border-t border-gray-200 dark:border-gray-700" />
        <PostViewCommentList
          postId={postId}
          refresh={refreshComments}
          hasDeleteCommentPrivilege={isAdmin || isAuthor}
        />
      </div>
      <PostViewCreateComment
        post={post}
        onCommentCreated={triggerRefreshComments}
      />

      <EditPostModal
        post={post}
        isOpen={isModalOpen}
        onClose={closeModal}
        onPostUpdated={() => {}}
      />
    </>
  );
}
