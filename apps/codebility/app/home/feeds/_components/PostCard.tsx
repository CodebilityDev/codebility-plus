import { useEffect, useState } from "react";
import Image from "next/image";
import FeedPostModal from "@/components/modals/FeedPostModal";
import { Box } from "@/components/shared/dashboard";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { format } from "date-fns";
import toast from "react-hot-toast";

import { deletePost } from "../_services/action";
import { PostType } from "../_services/query";
import { DeleteDialog } from "./DeleteDialog";
import PostCommentCount from "./PostCommentCount";
import PostTags from "./PostTags";
import PostUpvote from "./PostUpvote";

interface PostProps {
  post: PostType;
  isAdmin?: boolean;
  onDelete?: (deletedPostId: string | number) => void;
}

export default function Post({ post, isAdmin, onDelete }: PostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;
    setIsAuthor(user.id === post.author_id?.id);
  }, [user, post.author_id?.id]);

  const openDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      if (onDelete) onDelete(post.id);
      toast.success("Post deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete post.");
      console.error("Failed to delete post:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isSystemPost = post.id === "00000000-0000-0000-0000-000000000001";

  return (
    <div>
      {/* Card */}
      <div
        onClick={openModal}
        className="group relative flex h-[440px] cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-cyan-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-cyan-500/40 dark:hover:shadow-lg dark:hover:shadow-cyan-500/5"
      >
        {/* Delete button */}
        {(isAdmin || isAuthor) && !isSystemPost && (
          <button
            className="invisible absolute right-2 top-2 z-10 rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-600 group-hover:visible"
            onClick={openDeleteDialog}
            aria-label="Delete post"
          >
            ✕
          </button>
        )}

        {/* Title */}
        <div className="px-4 pt-4">
          <p className="line-clamp-2 text-base font-semibold leading-snug text-gray-800 dark:text-gray-100">
            {post.title}
          </p>
        </div>

        {/* Thumbnail image — takes up most of the card */}
        <div className="mx-4 mt-2 flex-1 overflow-hidden rounded-xl">
          <img
            src={post.image_url || "/assets/images/bg-certificate.png"}
            alt="Post image"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>

        {/* Footer: author + date on left, upvotes + comments on right */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Image
              src={
                post.author_id?.image_url ||
                (isSystemPost ? "/favicon.ico" : defaultAvatar)
              }
              alt={`${post.author_id?.first_name || "Codebility"}'s profile`}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200 dark:ring-white/10"
              width={28}
              height={28}
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                {post.author_id?.first_name
                  ? `${post.author_id.first_name} ${post.author_id.last_name}`
                  : "Codebility"}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                {format(new Date(post.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <PostUpvote post={post} />
            <PostCommentCount post={post} />
          </div>
        </div>
      </div>

      <FeedPostModal isOpen={isModalOpen} onClose={closeModal} postId={post.id} />
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}