"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import EditPostModal from "@/components/modals/EditPostModal";
import { Box } from "@/components/shared/dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { createClientClientComponent } from "@/utils/supabase/client";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { PostType } from "../_services/query";
import PostUpvote from "../_components/PostUpvote";
import { getUserRole } from "../_services/action";

interface PostViewProps {
  postId: string;
}

export default function PostView({ postId }: PostViewProps) {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const [post, setPost] = useState<PostType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMentor, setIsMentor] = useState(true);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const role = await getUserRole(user.role_id ?? null);
      setIsMentor(role === "Mentor" || role === "Admin");
    };

    if (user) {
      fetchRole();
    }
  }, [user]);

  const fetchPost = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*,
          author_id(
            first_name,
            last_name,
            image_url
          )`,
        )
        .eq("id", postId)
        .single();

      if (error) throw error;
      setPost(data || null);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  useEffect(() => {
    if (supabase) {
      fetchPost();
    }
  }, [postId, supabase]);

  if (error) {
    return <div className="p-4 text-red-500">Error loading post: {error}</div>;
  }

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

      <PostUpvote post={post} />

      <div className="prose prose-sm dark:prose-invert max-h-[800px] min-h-[160px] max-w-none overflow-y-auto p-4 text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {`![Post image](${post.image_url || "/assets/images/bg-certificate.png"})\n\n${post.content}`}
        </ReactMarkdown>
      </div>

      {isMentor && (
        <Button className="mb-4 mt-4 w-auto" onClick={openModal}>
          Edit Post
        </Button>
      )}
      <EditPostModal
        post={post}
        isOpen={isModalOpen}
        onClose={closeModal}
        onPostUpdated={fetchPost}
      />
    </>
  );
}
