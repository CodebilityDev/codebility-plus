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
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp
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

// Comment interface matching database structure
interface TaskComment {
  id: string;
  task_id: string;
  author_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    image_url: string | null;
  };
  replies?: TaskComment[];
}

// Database comment interface
interface DbComment {
  id: string;
  task_id: string;
  content: string;
  author_id: string;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
  codev: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string | null;
  } | null;
}

// Utility function to format comment text with clickable links and preserved formatting
const formatCommentText = (text: string): JSX.Element => {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  
  // Split text by newlines first to preserve line breaks
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, lineIndex) => {
        // Split each line by URLs
        const parts = line.split(urlPattern);
        
        return (
          <span key={lineIndex}>
            {parts.map((part, partIndex) => {
              // Check if this part is a URL
              if (urlPattern.test(part)) {
                return (
                  <a
                    key={partIndex}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {part}
                  </a>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
            {lineIndex < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
};

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

// Memoized ReplyItem component
const ReplyItem = memo(function ReplyItem({
  reply,
  currentUserId,
  onEdit,
  onDelete,
}: {
  reply: TaskComment;
  currentUserId: string;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const isOwner = reply.author_id === currentUserId;
  const isEdited = reply.created_at !== reply.updated_at;

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditContent(reply.content);
    setDropdownOpen(false);
  }, [reply.content]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditContent(reply.content);
  }, [reply.content]);

  const handleSaveEdit = useCallback(() => {
    if (editContent.trim() && editContent !== reply.content) {
      onEdit(reply.id, editContent.trim());
    }
    setIsEditing(false);
  }, [reply.id, reply.content, editContent, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(reply.id);
    setDropdownOpen(false);
  }, [reply.id, onDelete]);

  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="h-7 w-7 sm:h-8 sm:w-8 mt-2 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        {reply.author.image_url ? (
          <Image
            src={reply.author.image_url}
            alt={reply.author.name}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <DefaultAvatar size={28} />
        )}
      </div>

      <div className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white block truncate">
              {reply.author.name}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <CommentTimeAgo date={isEdited ? reply.updated_at : reply.created_at} isEdited={isEdited} />
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
                disabled={!editContent.trim() || editContent === reply.content}
                className="text-xs sm:text-sm h-8 sm:h-9 bg-blue-600 hover:bg-blue-700"
              >
                <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">
            {formatCommentText(reply.content)}
          </p>
        )}
      </div>
    </div>
  );
});

// Memoized CommentItem component
const CommentItem = memo(function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
}: {
  comment: TaskComment;
  currentUserId: string;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReply: (parentId: string, content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  
  const isOwner = comment.author_id === currentUserId;
  const isEdited = comment.created_at !== comment.updated_at;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length || 0;

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

  const handleStartReply = useCallback(() => {
    setIsReplying(true);
    setShowReplies(true);
  }, []);

  const handleCancelReply = useCallback(() => {
    setIsReplying(false);
    setReplyContent("");
  }, []);

  const handleSubmitReply = useCallback(() => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setIsReplying(false);
    }
  }, [comment.id, replyContent, onReply]);

  return (
    <div className="space-y-2">
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

        <div className="flex-1 min-w-0">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-gray-700 dark:bg-gray-800">
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
              <p className="text-xs sm:text-sm leading-relaxed text-gray-700 dark:text-gray-300 break-words whitespace-pre-wrap">
                {formatCommentText(comment.content)}
              </p>
            )}
          </div>

          {/* Reply button - Facebook style */}
          {!isEditing && (
            <div className="mt-1 ml-3 flex items-center gap-4">
              <button
                onClick={handleStartReply}
                className="text-xs font-semibold text-gray-600 hover:underline dark:text-gray-400"
              >
                Reply
              </button>
              
              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  {showReplies ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Hide {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      View {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Reply input form */}
          {isReplying && (
            <div className="mt-2 ml-3 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="resize-none text-sm border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelReply}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim()}
                  className="text-xs h-8 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="mr-1 h-3 w-3" />
                  Reply
                </Button>
              </div>
            </div>
          )}

          {/* Replies list */}
          {hasReplies && showReplies && (
            <div className="mt-3 ml-3 space-y-2.5 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
              {comment.replies!.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  currentUserId={currentUserId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
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

  // Transform database comment to UI comment format
  const transformComment = (dbComment: DbComment | any): TaskComment => {
    const user = Array.isArray(dbComment.codev) 
      ? dbComment.codev[0] 
      : dbComment.codev;
    
    const fullName = user 
      ? `${user.first_name} ${user.last_name}`.trim()
      : "Unknown User";
    
    return {
      id: dbComment.id,
      task_id: dbComment.task_id,
      author_id: dbComment.author_id,
      parent_comment_id: dbComment.parent_comment_id,
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

  // Organize comments into parent-child structure
  const organizeComments = (allComments: TaskComment[]): TaskComment[] => {
    const commentMap = new Map<string, TaskComment>();
    const topLevelComments: TaskComment[] = [];

    // Initialize all comments with empty replies array
    allComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Organize into parent-child structure
    allComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parent_comment_id === null) {
        topLevelComments.push(commentWithReplies);
      } else {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          parent.replies!.push(commentWithReplies);
        }
      }
    });

    return topLevelComments;
  };

  // Update parent component when comment count changes
  useEffect(() => {
    if (!isLoading) {
      const totalCount = comments.reduce((acc, comment) => {
        return acc + 1 + (comment.replies?.length || 0);
      }, 0);
      onCommentCountChange?.(totalCount);
    }
  }, [comments, isLoading, onCommentCountChange]);

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
            parent_comment_id,
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

        if (error) throw error;

        if (data) {
          const transformedComments = data.map(transformComment);
          const organizedComments = organizeComments(transformedComments);
          setComments(organizedComments);
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
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const { data, error } = await supabase
              .from("tasks_comments")
              .select(`
                id,
                task_id,
                content,
                author_id,
                parent_comment_id,
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
              setComments((prev) => {
                const flatComments: TaskComment[] = [];
                prev.forEach(comment => {
                  flatComments.push(comment);
                  if (comment.replies) {
                    flatComments.push(...comment.replies);
                  }
                });

                const existingIndex = flatComments.findIndex(c => c.id === data.id);
                if (existingIndex >= 0) {
                  flatComments[existingIndex] = transformComment(data);
                } else {
                  flatComments.push(transformComment(data));
                }

                return organizeComments(flatComments);
              });
            }
          } else if (payload.eventType === "DELETE") {
            setComments((prev) => {
              const flatComments: TaskComment[] = [];
              prev.forEach(comment => {
                flatComments.push(comment);
                if (comment.replies) {
                  flatComments.push(...comment.replies);
                }
              });

              const filtered = flatComments.filter(c => c.id !== payload.old.id);
              return organizeComments(filtered);
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, supabase]);

  const handleSubmitComment = useCallback(
  async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !supabase) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from("tasks_comments").insert({
        task_id: taskId,
        content: newComment.trim(),
        author_id: currentUserId,
        parent_comment_id: null,
      }).select(`
        id,
        task_id,
        content,
        author_id,
        parent_comment_id,
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

      // Optimistically add the comment
      if (data) {
        setComments((prev) => {
          const flatComments: TaskComment[] = [];
          prev.forEach(comment => {
            flatComments.push(comment);
            if (comment.replies) {
              flatComments.push(...comment.replies);
            }
          });
          
          flatComments.push(transformComment(data));
          return organizeComments(flatComments);
        });
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

  const handleReply = useCallback(
  async (parentId: string, content: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase.from("tasks_comments").insert({
        task_id: taskId,
        content: content,
        author_id: currentUserId,
        parent_comment_id: parentId,
      }).select(`
        id,
        task_id,
        content,
        author_id,
        parent_comment_id,
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

      // Optimistically add the reply
      if (data) {
        setComments((prev) => {
          const flatComments: TaskComment[] = [];
          prev.forEach(comment => {
            flatComments.push(comment);
            if (comment.replies) {
              flatComments.push(...comment.replies);
            }
          });
          
          flatComments.push(transformComment(data));
          return organizeComments(flatComments);
        });
      }

      toast.success("Reply posted successfully");
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
    }
  },
  [taskId, currentUserId, supabase]
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
          parent_comment_id,
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

      // Optimistically update the comment/reply
      if (data) {
        setComments((prev) => {
          const flatComments: TaskComment[] = [];
          prev.forEach(comment => {
            flatComments.push(comment);
            if (comment.replies) {
              flatComments.push(...comment.replies);
            }
          });

          const updatedComments = flatComments.map(c => 
            c.id === data.id ? transformComment(data) : c
          );
          return organizeComments(updatedComments);
        });
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

        // Optimistically remove the comment/reply
        setComments((prev) => {
          const flatComments: TaskComment[] = [];
          prev.forEach(comment => {
            flatComments.push(comment);
            if (comment.replies) {
              flatComments.push(...comment.replies);
            }
          });

          const filteredComments = flatComments.filter(c => c.id !== commentId);
          return organizeComments(filteredComments);
        });

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
        <div className="space-y-3 sm:space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReply={handleReply}
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