import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FeedPostModal from "@/components/modals/FeedPostModal";
import { Box } from "@/components/shared/dashboard";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { format } from "date-fns";
import { ArrowBigUp, MessageSquare } from "lucide-react";
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
    const checkIfAuthor = async () => {
      if (!user) return;
      if (user.id === post.author_id?.id) {
        setIsAuthor(true);
      } else {
        setIsAuthor(false);
      }
    };

    if (user) {
      checkIfAuthor();
    }
  }, [user, post.author_id?.id]);

  const openDeleteDialog = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      if (onDelete) {
        onDelete(post.id);
      }
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

  return (
    <div>
      <Box
        className="group relative flex h-[440px] cursor-pointer flex-col justify-between rounded-xl p-3"
        onClick={openModal}
      >
        {/* Delete Button in top-right */}
        {(isAdmin || isAuthor) && post.id !== "00000000-0000-0000-0000-000000000001" && (
          <button
            className="invisible absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 group-hover:visible"
            onClick={openDeleteDialog}
            aria-label="Delete post"
          >
            ✕
          </button>
        )}

        <div className="mx-4 mt-2 h-[200px]">
          <div className="flex items-center justify-between">
            <div className="mb-2 flex items-center">
              <Image
                src={
                  post.author_id?.image_url || 
                  (post.id === "00000000-0000-0000-0000-000000000001" ? "/favicon.ico" : defaultAvatar)
                }
                alt={`${post.author_id?.first_name || "Codebility"}'s profile`}
                className="mr-4 h-12 w-12 rounded-full object-cover"
                width={30}
                height={30}
              />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                  {post.author_id?.first_name
                    ? `${post.author_id?.first_name} ${post.author_id?.last_name}`
                    : "Codebility"}
                </h2>
              </div>
            </div>
          </div>

          <div className="h-[60px] flex-grow">
            <p className="mt-2 line-clamp-2 text-xl font-semibold leading-snug text-gray-700 dark:text-gray-300">
              {post.title}
            </p>
          </div>
          <div className="mb-2">
            <PostTags post={post} minimal={true} />
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(post.created_at), "MMM d, yyyy")}
          </p>
        </div>

        <div className="my-2 h-60 w-full overflow-hidden rounded-sm">
          <img
            src={post.image_url || "/assets/images/bg-certificate.png"}
            alt="Post image"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mx-4 flex items-center space-x-4 text-gray-600 dark:text-gray-400">
          <PostUpvote post={post} />

          <PostCommentCount post={post} />
        </div>
      </Box>
      <FeedPostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        postId={post.id}
      />
      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}