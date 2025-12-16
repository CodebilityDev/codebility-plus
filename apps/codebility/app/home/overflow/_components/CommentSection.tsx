"use client";

import { useState, useEffect, memo, useCallback } from "react";
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
import { 
  fetchComments, 
  postComment, 
  toggleCommentLike, 
  updateComment, 
  deleteComment, 
  fetchCommentLikes,
  type Comment 
} from "../actions";
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

// Memoized Avatar component
const CommentAvatar = memo(function CommentAvatar({ 
  imageUrl, 
  name 
}: { 
  imageUrl: string | null; 
  name: string;
}) {
  return (
    <div className="h-8 w-8 sm:h-10 sm:w-10 mt-2 sm:mt-3 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      ) : (
        <DefaultAvatar size={32} />
      )}
    </div>
  );
});

// Memoized action buttons component
const CommentActions = memo(function CommentActions({
  commentId,
  isLiked,
  likes,
  isOwner,
  onLike,
  onEdit,
  onDelete,
}: {
  commentId: string;
  isLiked: boolean;
  likes: number;
  isOwner: boolean;
  onLike: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLike = useCallback(() => {
    onLike(commentId);
  }, [commentId, onLike]);

  const handleEdit = useCallback(() => {
    onEdit();
    setDropdownOpen(false);
  }, [onEdit]);

  const handleDelete = useCallback(() => {
    onDelete();
    setTimeout(() => {
      setDropdownOpen(false);
    }, 0);
  }, [onDelete]);

  return (
    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 h-auto ${
          isLiked
            ? "text-red-600 hover:text-red-700"
            : "text-gray-600 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
        }`}
      >
        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-xs sm:text-sm">{likes}</span>
      </Button>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={!isOwner}
            size="sm"
            className="px-1.5 sm:px-2 py-1 h-auto text-gray-600 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
          >
            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32 sm:w-auto">
          <DropdownMenuItem onClick={handleEdit} className="text-xs sm:text-sm">
            <Pencil className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete}
            onSelect={(e) => e.preventDefault()}
            className="text-xs sm:text-sm text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
          >
            <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

// Memoized edit form component
const CommentEditForm = memo(function CommentEditForm({
  initialContent,
  onSave,
  onCancel,
}: {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}) {
  const [editContent, setEditContent] = useState(initialContent);

  const handleSave = useCallback(() => {
    if (editContent.trim() && editContent !== initialContent) {
      onSave(editContent.trim());
    }
  }, [editContent, initialContent, onSave]);

  return (
    <div className="space-y-2">
      <Textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        rows={3}
        className="resize-none border-gray-300 bg-white text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-xs sm:text-sm h-8 sm:h-9 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
        >
          <X className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!editContent.trim() || editContent === initialContent}
          className="text-xs sm:text-sm h-8 sm:h-9"
        >
          <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          Save
        </Button>
      </div>
    </div>
  );
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

    const handleStartEdit = useCallback(() => {
      setIsEditing(true);
    }, []);

    const handleCancelEdit = useCallback(() => {
      setIsEditing(false);
    }, []);

    const handleSaveEdit = useCallback((newContent: string) => {
      onEdit(comment.id, newContent);
      setIsEditing(false);
    }, [comment.id, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(comment.id);
    }, [comment.id, onDelete]);

    return (
      <div className="flex gap-2 sm:gap-3">
        <CommentAvatar 
          imageUrl={comment.author.image_url} 
          name={comment.author.name}
        />

        <div className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block truncate">
                {comment.author.name}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-white">
                <Clock className="h-3 w-3 flex-shrink-0" />
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
            
            {!isEditing && (
              <CommentActions
                commentId={comment.id}
                isLiked={isLiked}
                likes={comment.likes}
                isOwner={isOwner}
                onLike={onLike}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

          {isEditing ? (
            <CommentEditForm
              initialContent={comment.content}
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-white break-words">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    );
  }
);

// Memoized loading component
const LoadingState = memo(function LoadingState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex justify-center">
        <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-2 border-gray-200 border-t-customBlue-500 dark:border-gray-700 dark:border-t-customBlue-400"></div>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-white">Loading comments...</p>
    </div>
  );
});

// Memoized empty state component
const EmptyState = memo(function EmptyState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="text-xs sm:text-sm text-gray-600 dark:text-white">
        No comments yet. Be the first to help!
      </p>
    </div>
  );
});

export default function CommentSection({ questionId, loggedIn, setQuestions }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Memoize loadComments function
  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedComments, likedCommentIds] = await Promise.all([
        fetchComments(questionId),
        fetchCommentLikes(loggedIn.id, questionId)
      ]);
      
      setComments(fetchedComments);
      setLikedComments(new Set(likedCommentIds));
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [questionId, loggedIn.id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Memoize handleSubmitComment
  const handleSubmitComment = useCallback(async (e: React.FormEvent) => {
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
            setQuestions(result.questions);
          })
          .catch((error) => {
            console.error('Fetch error:', error);
          });
        setComments(prev => [...prev, result.comment]);
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
  }, [newComment, questionId, loggedIn.id, setQuestions]);

  // Memoize handleLikeComment
  const handleLikeComment = useCallback(async (commentId: string) => {
    const wasLiked = likedComments.has(commentId);
    const newLikedComments = new Set(likedComments);

    // Optimistic update
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

    setLikedComments(newLikedComments);

    try {
      const result = await toggleCommentLike(commentId, loggedIn.id);

      if (!result.success) {
        // Revert on failure
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
        setLikedComments(newLikedComments);
        console.error("Failed to toggle like:", result.error);
      }
    } catch (error) {
      // Revert on error
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
      setLikedComments(newLikedComments);
      console.error("Error toggling like:", error);
    }
  }, [likedComments, loggedIn.id]);

  // Memoize handleEditComment
  const handleEditComment = useCallback(async (commentId: string, newContent: string) => {
    const originalComment = comments.find(c => c.id === commentId);
    if (!originalComment) return;

    const originalContent = originalComment.content;
    const originalUpdatedAt = originalComment.updated_at;

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
        setComments(prev =>
          prev.map(c => c.id === commentId 
            ? { ...c, content: originalContent, updated_at: originalUpdatedAt } 
            : c
          )
        );
        alert("Failed to update comment. Please try again.");
      } else if (result.comment) {
        setComments(prev =>
          prev.map(c => c.id === commentId ? result.comment! : c)
        );
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      setComments(prev =>
        prev.map(c => c.id === commentId 
          ? { ...c, content: originalContent, updated_at: originalUpdatedAt } 
          : c
        )
      );
      alert("An error occurred while updating your comment.");
    }
  }, [comments]);

  // Memoize handleDeleteComment
  const handleDeleteComment = useCallback((commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  }, []);

  // Memoize confirmDelete
  const confirmDelete = useCallback(async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);

    try {
      const result = await deleteComment(commentToDelete);

      if (result.success) {
        setComments(prev => prev.filter(c => c.id !== commentToDelete));
        
        fetchQuestions()
          .then((result) => {
            setQuestions(result.questions);
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
  }, [commentToDelete, setQuestions]);

  // Memoize cancelDelete
  const cancelDelete = useCallback(() => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setCommentToDelete(null);
  }, [isDeleting]);

  // Memoize handleDialogChange
  const handleDialogChange = useCallback((open: boolean) => {
    if (!open && isDeleting) return;
    setDeleteModalOpen(open);
    if (!open) {
      setCommentToDelete(null);
    }
  }, [isDeleting]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="w-[90vw] max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Delete Comment</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={cancelDelete}
              disabled={isDeleting}
              className="text-xs sm:text-sm h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="text-xs sm:text-sm h-9 bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3">
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
      <form onSubmit={handleSubmitComment} className="space-y-2 sm:space-y-3">
        <Textarea
          placeholder="Write a helpful comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
          rows={3}
          className="resize-none text-sm sm:text-base border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
            className="text-xs sm:text-sm h-9"
          >
            <Send className="mr-1.5 sm:mr-2 h-4 w-4" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {comments.length === 0 && <EmptyState />}
    </div>
  );
}