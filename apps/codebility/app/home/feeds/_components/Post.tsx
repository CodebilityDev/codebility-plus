import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FeedPostModal from "@/components/modals/FeedPostModal";
import { Box } from "@/components/shared/dashboard";
import { defaultAvatar } from "@/public/assets/images";
import { format } from "date-fns";
import { ArrowBigUp } from "lucide-react";
import toast from "react-hot-toast";

import { deletePost } from "../_services/action";
import { PostType } from "../_services/query";
import PostUpvote from "./PostUpvote";

interface PostProps {
  post: PostType;
  isMentor?: boolean;
  onDelete?: (deletedPostId: string | number) => void;
}

export default function Post({ post, isMentor, onDelete }: PostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await deletePost(post.id);
      toast.success("Post deleted successfully!");

      if (onDelete) {
        onDelete(post.id);
      }
    } catch (error) {
      toast.error("Failed to delete post.");
      console.error("Failed to delete post:", error);
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // You can add upvote logic here
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <Box
        className="group relative flex h-[400px] cursor-pointer flex-col justify-between p-3"
        onClick={openModal}
      >
        {/* Delete Button in top-right */}
        {isMentor && (
          <button
            className="invisible absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 group-hover:visible"
            onClick={handleDelete}
            aria-label="Delete post"
          >
            ✕
          </button>
        )}

        <div className="mx-4 mt-2 h-[200px]">
          <div className="flex items-center justify-between">
            <div className="mb-2 flex items-center">
              <Image
                src={post.author_id?.image_url || defaultAvatar}
                alt={`${post.author_id?.first_name}'s profile`}
                className="mr-4 h-12 w-12 rounded-full object-cover"
                width={40}
                height={40}
              />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  {post.author_id
                    ? `${post.author_id?.first_name} ${post.author_id?.last_name}`
                    : "Codebility"}
                </h2>
              </div>
            </div>
          </div>

          <div className="h-[60px] flex-grow">
            <p className="mt-2 line-clamp-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              {post.title}
            </p>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(post.created_at), "MMM d, yyyy")}
          </p>
        </div>

        <div className="h-60 w-full overflow-hidden rounded-sm">
          <img
            src={post.image_url || "/assets/images/bg-certificate.png"}
            alt="Post image"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-4 mt-4 flex items-center space-x-4 text-gray-600 dark:text-gray-400">
          <PostUpvote post={post} />
        </div>
      </Box>
      <FeedPostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        postId={post.id}
      />
    </>
  );
}
