"use client";

import { useState, useEffect, memo, useCallback } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  X,
  Check,
  Send
} from "lucide-react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Textarea } from "@codevs/ui/textarea";
import { createClientClientComponent } from "@/utils/supabase/client";

// Comment interface
interface TaskComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image_url: string | null;
  };
  created_at: string;
  updated_at: string;
}

// Database comment interface
interface DbComment {
  id: string;
  task_id: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  codev: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string | null;
  } | null;
}

// Memoized TimeAgo component
const CommentTimeAgo = memo(function CommentTimeAgo({ 
  date, 
  isEdited 
}: { 
  date: string; 
  isEdited?: boolean;
}) {
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

  return (
    <>
      {text}
      {isEdited && <span className="text-gray-400 dark:text-gray-500 ml-1">(edited)</span>}
    </>
  );
});

// Memoized CommentItem component
const CommentItem = memo(function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
}: {
  comment: TaskComment;
  currentUserId: string;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const isOwner = comment.author.id === currentUserId;
  const isEdited = comment.created_at !== comment.updated_at;

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditContent(comment.content);
    setDropdownOpen(false);
  }, [comment.content]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditContent(comment.content);
  }, [comment.content]);

  const handleSaveEdit = useCallback(() => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment.id, editContent.trim());
    }
    setIsEditing(false);
  }, [comment.id, comment.content, editContent, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(comment.id);
    setDropdownOpen(false);
  }, [comment.id, onDelete]);

  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="h-8 w-8 sm:h-10 sm:w-10 mt-2 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        {comment.author.image_url ? (
          <Image
            src={comment.author.image_url}
            alt={comment.author.name}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <DefaultAvatar size={32} />
        )}
      </div>

      <div className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block truncate">
              {comment.author.name}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <CommentTimeAgo date={isEdited ? comment.updated_at : comment.created_at} isEdited={isEdited} />
            </div>
          </div>
          
          {!isEditing && isOwner && (
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-1.5 sm:px-2 py-1 h-auto text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32 sm:w-auto">
                  <DropdownMenuItem onClick={handleStartEdit} className="text-xs sm:text-sm">
                    <Pencil className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-xs sm:text-sm text-red-600 focus:text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="resize-none border-gray-300 bg-white text-sm sm:text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <X className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || editContent === comment.content}
                className="text-xs sm:text-sm h-8 sm:h-9 bg-blue-600 hover:bg-blue-700"
              >
                <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 break-words">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
});

// Main exported component
export default function TaskCommentsSection({
  taskId,
  currentUserId,
  onCommentCountChange,
}: {
  taskId: string;
  currentUserId: string;
  onCommentCountChange?: (count: number) => void;
}) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientClientComponent();

  // Update parent component when comment count changes (only when loaded)
  useEffect(() => {
    if (!isLoading) {
      onCommentCountChange?.(comments.length);
    }
  }, [comments.length, isLoading, onCommentCountChange]);

  // Transform database comment to UI comment format
  const transformComment = (dbComment: DbComment | any): TaskComment => {
    // Handle both array and object formats for codev
    const user = Array.isArray(dbComment.codev) 
      ? dbComment.codev[0] 
      : dbComment.codev;
    
    const fullName = user 
      ? `${user.first_name} ${user.last_name}`.trim()
      : "Unknown User";
    
    return {
      id: dbComment.id,
      content: dbComment.content,
      author: {
        id: dbComment.author_id,
        name: fullName,
        image_url: user?.image_url || null,
      },
      created_at: dbComment.created_at,
      updated_at: dbComment.updated_at,
    };
  };

  // Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from("tasks_comments")
          .select(`
            id,
            task_id,
            content,
            author_id,
            created_at,
            updated_at,
            codev (
              id,
              first_name,
              last_name,
              image_url
            )
          `)
          .eq("task_id", taskId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Raw Supabase data:", data); // Debug log

        if (data) {
          const transformedComments = data.map(transformComment);
          console.log("Transformed comments:", transformedComments); // Debug log
          setComments(transformedComments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [taskId, supabase]);

  // Subscribe to real-time updates
  useEffect(() => {
    console.log("Setting up real-time subscription for task:", taskId);
    if (!supabase) return;

    const channel = supabase
      .channel(`task_comments_${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks_comments",
          filter: `task_id=eq.${taskId}`,
        },
        async (payload) => {
          console.log("Real-time event received:", payload.eventType, payload);
          
          if (payload.eventType === "INSERT") {
            // Fetch the new comment with user data
            const { data, error } = await supabase
              .from("tasks_comments")
              .select(`
                id,
                task_id,
                content,
                author_id,
                created_at,
                updated_at,
                codev (
                  id,
                  first_name,
                  last_name,
                  image_url
                )
              `)
              .eq("id", payload.new.id)
              .single();

            if (!error && data) {
              console.log("Adding new comment:", data);
              setComments((prev) => [...prev, transformComment(data)]);
            }
          } else if (payload.eventType === "UPDATE") {
            // Fetch the updated comment with user data
            const { data, error } = await supabase
              .from("tasks_comments")
              .select(`
                id,
                task_id,
                content,
                author_id,
                created_at,
                updated_at,
                codev (
                  id,
                  first_name,
                  last_name,
                  image_url
                )
              `)
              .eq("id", payload.new.id)
              .single();

            if (!error && data) {
              console.log("Updating comment:", data);
              setComments((prev) =>
                prev.map((c) => (c.id === data.id ? transformComment(data) : c))
              );
            }
          } else if (payload.eventType === "DELETE") {
            console.log("Deleting comment:", payload.old.id);
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [taskId, supabase]);

  const handleSubmitComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;

      setIsSubmitting(true);
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from("tasks_comments").insert({
          task_id: taskId,
          content: newComment.trim(),
          author_id: currentUserId,
        }).select(`
          id,
          task_id,
          content,
          author_id,
          created_at,
          updated_at,
          codev (
            id,
            first_name,
            last_name,
            image_url
          )
        `).single();

        if (error) throw error;

        // Optimistically add the comment to the UI
        if (data) {
          setComments((prev) => [...prev, transformComment(data)]);
        }

        setNewComment("");
        toast.success("Comment posted successfully");
      } catch (error) {
        console.error("Error posting comment:", error);
        toast.error("Failed to post comment");
      } finally {
        setIsSubmitting(false);
      }
    },
    [newComment, taskId, currentUserId, supabase]
  );

  const handleEditComment = useCallback(
    async (commentId: string, newContent: string) => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from("tasks_comments")
          .update({
            content: newContent,
            updated_at: new Date().toISOString(),
          })
          .eq("id", commentId)
          .select(`
            id,
            task_id,
            content,
            author_id,
            created_at,
            updated_at,
            codev (
              id,
              first_name,
              last_name,
              image_url
            )
          `)
          .single();

        if (error) throw error;

        // Optimistically update the comment in the UI
        if (data) {
          setComments((prev) =>
            prev.map((c) => (c.id === data.id ? transformComment(data) : c))
          );
        }

        toast.success("Comment updated successfully");
      } catch (error) {
        console.error("Error updating comment:", error);
        toast.error("Failed to update comment");
      }
    },
    [supabase]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
        if (!supabase) return;
      try {
        const { error } = await supabase
          .from("tasks_comments")
          .delete()
          .eq("id", commentId);

        if (error) throw error;

        // Optimistically remove the comment from the UI
        setComments((prev) => prev.filter((c) => c.id !== commentId));

        toast.success("Comment deleted successfully");
      } catch (error) {
        console.error("Error deleting comment:", error);
        toast.error("Failed to delete comment");
      }
    },
    [supabase]
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Loading comments...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {comments.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="space-y-2 sm:space-y-3">
        <Textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
          rows={3}
          className="resize-none text-sm sm:text-base border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
            className="text-xs sm:text-sm h-9 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="mr-1.5 sm:mr-2 h-4 w-4" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {comments.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </p>
        </div>
      )}
    </div>
  );
}

// Export the type for use in other files
export type { TaskComment };