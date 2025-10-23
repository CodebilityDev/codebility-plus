"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";

import { Textarea } from "@codevs/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heart, Send, Clock, MoreVertical, Pencil, Trash2, X, Check } from "lucide-react";
import { fetchComments, postComment, toggleCommentLike, updateComment, deleteComment, type Comment } from "../actions";
import { Question, fetchQuestions } from "../actions";

interface CommentSectionProps {
  questionId: string;
  loggedIn: {
    id: string;
    name: string;
    image_url: string | null;
  };
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

// Extract TimeAgo as a separate memoized component
const TimeAgo = memo(function TimeAgo({ date }: { date: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const now = new Date();
    const created = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) setText("just now");
    else if (diffInMinutes < 60) setText(`${diffInMinutes}m ago`);
    else if (diffInMinutes < 1440) setText(`${Math.floor(diffInMinutes / 60)}h ago`);
    else if (diffInMinutes < 10080) setText(`${Math.floor(diffInMinutes / 1440)}d ago`);
    else setText(created.toLocaleDateString());
  }, [date]);

  return <span>{text}</span>;
});

// Memoize the comment item to prevent unnecessary re-renders
const CommentItem = memo(
  function CommentItem({
    comment,
    isLiked,
    onLike,
    loggedInUserId,
    onEdit,
    onDelete
  }: {
    comment: Comment;
    isLiked: boolean;
    onLike: (id: string) => void;
    loggedInUserId: string;
    onEdit: (id: string, newContent: string) => void;
    onDelete: (id: string) => void;
  }) {
    const isOwner = comment.author.id === loggedInUserId;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleStartEdit = () => {
      setIsEditing(true);
      setEditContent(comment.content);
      setDropdownOpen(false);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditContent(comment.content);
    };

    const handleSaveEdit = () => {
      if (editContent.trim() && editContent !== comment.content) {
        onEdit(comment.id, editContent.trim());
      }
      setIsEditing(false);
    };

    const handleDelete = () => {
      onDelete(comment.id);
      // Use setTimeout to ensure modal opens before dropdown closes
      setTimeout(() => {
        setDropdownOpen(false);
      }, 0);
    };

    return (
      <div className="flex gap-3">
        <div className="h-10 w-10 mt-3 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          {comment.author.image_url ? (
            <Image
              src={comment.author.image_url}
              alt={comment.author.name}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar size={32} />
          )}
        </div>

        <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.author.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-white">
                  <Clock className="h-3 w-3" />
                  {comment.created_at === comment.updated_at ? (
                    <TimeAgo date={comment.created_at} />
                  ) : (
                    <span className="flex items-center gap-1">
                      <span>edited</span>
                      <TimeAgo date={comment.updated_at} />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 px-2 py-1 ${
                  isLiked
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-600 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm">{comment.likes}</span>
              </Button>

              {!isEditing && (
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                    disabled={!isOwner}
                      variant="ghost"
                      size="sm"
                      className="px-2 py-1 text-gray-600 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleStartEdit}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      onSelect={(e) => e.preventDefault()}
                      className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="resize-none border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || editContent === comment.content}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-gray-700 dark:text-white">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default function CommentSection({ questionId, loggedIn, setQuestions }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [questionId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await fetchComments(questionId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const result = await postComment({
        post_id: questionId,
        codev_id: loggedIn.id,
        comment: newComment.trim(),
      });

      if (result?.success && result?.comment) {
        fetchQuestions()
          .then((result) => {
            setQuestions(result);
          })
          .catch((error) => {
            console.error('Fetch error:', error);
          });
        setComments([...comments, result?.comment]);
        setNewComment("");
      } else {
        console.error("Failed to post comment:", result?.error);
        alert("Failed to post comment. Please try again.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("An error occurred while posting your comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const wasLiked = likedComments.has(commentId);
    const newLikedComments = new Set(likedComments);

    if (wasLiked) {
      newLikedComments.delete(commentId);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes - 1 } : c))
      );
    } else {
      newLikedComments.add(commentId);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
      );
    }

    setLikedComments(new Set(newLikedComments));

    try {
      const result = await toggleCommentLike(commentId, !wasLiked);

      if (!result.success) {
        if (wasLiked) {
          newLikedComments.add(commentId);
          setComments((prev) =>
            prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
          );
        } else {
          newLikedComments.delete(commentId);
          setComments((prev) =>
            prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes - 1 } : c))
          );
        }
        setLikedComments(new Set(newLikedComments));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    // Store original comment for potential revert
    const originalComment = comments.find(c => c.id === commentId);
    if (!originalComment) return;

    const originalContent = originalComment.content;
    const originalUpdatedAt = originalComment.updated_at;

    // Optimistically update the UI with current timestamp
    const newUpdatedAt = new Date().toISOString();
    setComments(prev =>
      prev.map(c => c.id === commentId 
        ? { ...c, content: newContent, updated_at: newUpdatedAt } 
        : c
      )
    );

    try {
      const result = await updateComment({
        comment_id: commentId,
        comment: newContent,
      });

      if (!result.success) {
        // Revert on failure
        setComments(prev =>
          prev.map(c => c.id === commentId 
            ? { ...c, content: originalContent, updated_at: originalUpdatedAt } 
            : c
          )
        );
        alert("Failed to update comment. Please try again.");
      } else if (result.comment) {
        // Update with actual server response
        setComments(prev =>
          prev.map(c => c.id === commentId ? result.comment! : c)
        );
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      // Revert on error
      setComments(prev =>
        prev.map(c => c.id === commentId 
          ? { ...c, content: originalContent, updated_at: originalUpdatedAt } 
          : c
        )
      );
      alert("An error occurred while updating your comment.");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);

    try {
      const result = await deleteComment(commentToDelete);

      if (result.success) {
        // Remove comment from UI
        setComments(prev => prev.filter(c => c.id !== commentToDelete));
        
        // Update question count
        fetchQuestions()
          .then((result) => {
            setQuestions(result);
          })
          .catch((error) => {
            console.error('Fetch error:', error);
          });
        
        setDeleteModalOpen(false);
        setCommentToDelete(null);
      } else {
        alert("Failed to delete comment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred while deleting your comment.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && isDeleting) return; // Prevent closing while deleting
    setDeleteModalOpen(open);
    if (!open) {
      setCommentToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-customBlue-500 dark:border-gray-700 dark:border-t-customBlue-400"></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-white">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isLiked={likedComments.has(comment.id)}
              onLike={handleLikeComment}
              loggedInUserId={loggedIn.id}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <Textarea
          placeholder="Write a helpful comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
          rows={3}
          className="resize-none border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
          >
            <Send className="mr-2 h-5 w-5" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {comments.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-white">
            No comments yet. Be the first to help!
          </p>
        </div>
      )}
    </div>
  );
}