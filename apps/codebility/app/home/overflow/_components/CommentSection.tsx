"use client";

import { useState, useEffect, memo, useCallback, useRef } from "react";
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
import { Heart, Send, Clock, MoreVertical, Pencil, Trash2, X, Check, ArrowBigUp, CheckCircle2, Circle } from "lucide-react";
import { 
  fetchComments, 
  postComment, 
  toggleCommentLike, 
  updateComment, 
  deleteComment, 
  fetchCommentLikes,
  markAsSolution,
  type Comment 
} from "../actions";
import { Question, fetchQuestions } from "../actions";
import { createClientClientComponent } from "@/utils/supabase/client";

interface CommentSectionProps {
  questionId: string;
  questionAuthorId: string; // ← needed to show "Mark as Solution" button only to post author
  loggedIn: {
    id: string;
    name: string;
    image_url: string | null;
  };
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  onSolutionMarked?: () => void; // ← add this
}

interface MentionUser {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  username?: string;
}

// Memoized MentionPopover component — renders absolutely above the textarea
const MentionPopover = memo(function MentionPopover({
  isOpen,
  users,
  isLoading,
  onSelectUser,
  onClose,
}: {
  isOpen: boolean;
  users: MentionUser[];
  isLoading: boolean;
  onSelectUser: (user: MentionUser) => void;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full left-0 right-0 z-50 mb-1 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-customBlue-500 dark:border-gray-700 dark:border-t-customBlue-400"></div>
        </div>
      ) : users.length > 0 ? (
        <>
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-t-lg">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
              Mention a user
            </p>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {users.map((user) => (
              <Button
                key={user.id}
                type="button"
                variant="ghost"
                onClick={() => onSelectUser(user)}
                className="w-full justify-start gap-2 px-3 py-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  {user.image_url ? (
                    <Image
                      src={user.image_url}
                      alt={`${user.first_name} ${user.last_name}`}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar size={32} />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </div>
                  {user.username && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      @{user.username}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No users found
        </div>
      )}
    </div>
  );
});

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

const CommentContentRenderer = memo(function CommentContentRenderer({ text }: { text: string }) {
  const mentionRegex = /@([A-Za-z\s]+)(?=\s|$)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  let parts: (string | { type: 'mention' | 'url'; value: string })[] = [];
  let lastIndex = 0;
  
  const mentions = [...text.matchAll(mentionRegex)];
  const urls = [...text.matchAll(urlRegex)];
  
  const allMatches = [
    ...mentions.map(m => ({ type: 'mention' as const, index: m.index!, value: m[0], endIndex: m.index! + m[0].length })),
    ...urls.map(u => ({ type: 'url' as const, index: u.index!, value: u[0], endIndex: u.index! + u[0].length }))
  ].sort((a, b) => a.index - b.index);
  
  for (const match of allMatches) {
    if (lastIndex < match.index) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push({ type: match.type, value: match.value });
    lastIndex = match.endIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === 'string') {
          return <span key={index}>{part}</span>;
        } else if (part.type === 'mention') {
          return (
            <span key={index} className="text-blue-500 underline font-medium">
              {part.value}
            </span>
          );
        } else if (part.type === 'url') {
          return (
            <a
              key={index}
              href={part.value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline cursor-pointer hover:text-blue-600"
            >
              {part.value}
            </a>
          );
        }
      })}
    </>
  );
});

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

const CommentActions = memo(function CommentActions({
  commentId,
  isLiked,
  likes,
  isOwner,
  isPostAuthor,
  isSolution,
  onLike,
  onEdit,
  onDelete,
  onMarkSolution,
}: {
  commentId: string;
  isLiked: boolean;
  likes: number;
  isOwner: boolean;
  isPostAuthor: boolean;
  isSolution: boolean;
  onLike: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkSolution: (id: string) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLike = useCallback(() => onLike(commentId), [commentId, onLike]);
  const handleEdit = useCallback(() => { onEdit(); setDropdownOpen(false); }, [onEdit]);
  const handleDelete = useCallback(() => { onDelete(); setTimeout(() => setDropdownOpen(false), 0); }, [onDelete]);
  const handleMarkSolution = useCallback(() => { onMarkSolution(commentId); setDropdownOpen(false); }, [commentId, onMarkSolution]);

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Checkmark — only visible to post author */}
      {isPostAuthor && (
        <button
          onClick={handleMarkSolution}
          title={isSolution ? "Unmark as solution" : "Mark as solution"}
          className={`transition-colors ${
            isSolution
              ? "text-emerald-400 hover:text-emerald-300"
              : "text-gray-500 hover:text-emerald-400"
          }`}
        >
          <CheckCircle2 className="h-5 w-5" />
        </button>
      )}

      {/* Upvote */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 transition-colors ${
          isLiked
            ? "text-orange-500 hover:text-orange-400"
            : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200"
        }`}
      >
        <ArrowBigUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-sm font-medium">{likes}</span>
      </button>

      {/* Kebab menu */}
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            disabled={!isOwner}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200 disabled:opacity-30 transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={handleEdit} className="text-sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            onSelect={(e) => e.preventDefault()}
            className="text-sm text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

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

// ─── Solution Badge ────────────────────────────────────────────────────────────
const SolutionBadge = memo(function SolutionBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
      Correct Answer
    </span>
  );
});

const CommentItem = memo(
  function CommentItem({
    comment,
    isLiked,
    onLike,
    loggedInUserId,
    questionAuthorId,
    onEdit,
    onDelete,
    onMarkSolution,
  }: {
    comment: Comment;
    isLiked: boolean;
    onLike: (id: string) => void;
    loggedInUserId: string;
    questionAuthorId: string;
    onEdit: (id: string, newContent: string) => void;
    onDelete: (id: string) => void;
    onMarkSolution: (commentId: string) => void;
  }) {
    const isOwner = comment.author.id === loggedInUserId;
    const isPostAuthor = loggedInUserId === questionAuthorId;
    const [isEditing, setIsEditing] = useState(false);

    const handleStartEdit = useCallback(() => setIsEditing(true), []);
    const handleCancelEdit = useCallback(() => setIsEditing(false), []);
    const handleSaveEdit = useCallback((newContent: string) => {
      onEdit(comment.id, newContent);
      setIsEditing(false);
    }, [comment.id, onEdit]);
    const handleDelete = useCallback(() => onDelete(comment.id), [comment.id, onDelete]);

    return (
      <div className="flex gap-3 items-start">
        {/* Avatar — outside the card */}
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-700 mt-1">
          {comment.author.image_url ? (
            <Image
              src={comment.author.image_url}
              alt={comment.author.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar size={40} />
          )}
        </div>

        {/* Card */}
        <div
          className={`flex-1 min-w-0 rounded-xl border px-4 py-3 transition-colors ${
            comment.marked_as_solution
              ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-gray-800"
              : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          }`}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            {/* Left: name + badge + timestamp stacked */}
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {comment.author.username ? `@${comment.author.username}` : comment.author.name}
                </span>
                {comment.marked_as_solution && <SolutionBadge />}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
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

            {/* Right: actions */}
            {!isEditing && (
              <CommentActions
                commentId={comment.id}
                isLiked={isLiked}
                likes={comment.likes}
                isOwner={isOwner}
                isPostAuthor={isPostAuthor}
                isSolution={comment.marked_as_solution}
                onLike={onLike}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
                onMarkSolution={onMarkSolution}
              />
            )}
          </div>

          {/* Body */}
          <div className="mt-3">
            {isEditing ? (
              <CommentEditForm
                initialContent={comment.content}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                <CommentContentRenderer text={comment.content} />
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

const LoadingState = memo(function LoadingState() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-customBlue-500 dark:border-gray-700 dark:border-t-customBlue-400"></div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading comments...</p>
    </div>
  );
});

const EmptyState = memo(function EmptyState() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No comments yet. Be the first to help!
      </p>
    </div>
  );
});

export default function CommentSection({ questionId, questionAuthorId, loggedIn, setQuestions, onSolutionMarked }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mention state
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const searchUsers = useCallback(async (query: string): Promise<MentionUser[]> => {
    setIsSearching(true);
    try {
      const supabase = createClientClientComponent();
      if (!supabase) return [];

      let request = supabase
        .from('codev')
        .select('id, first_name, last_name, image_url, username');

      if (query && query.trim().length > 0) {
        request = request.or(
          `first_name.ilike.%${query}%,last_name.ilike.%${query}%,username.ilike.%${query}%`
        );
      }

      const { data, error } = await request.limit(10);
      if (error) return [];
      return (data as MentionUser[]) || [];
    } catch {
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleCommentChange = useCallback(async (value: string) => {
    setNewComment(value);

    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex === -1) { setShowMentionPopover(false); return; }

    const textAfterAt = value.substring(lastAtIndex + 1);
    if (textAfterAt.includes(' ')) { setShowMentionPopover(false); return; }

    const results = await searchUsers(textAfterAt.trim());
    setMentionUsers(results);
    setShowMentionPopover(true);
  }, [searchUsers]);

  const handleSelectMentionUser = useCallback((user: MentionUser) => {
    const lastAtIndex = newComment.lastIndexOf('@');
    const textBeforeAt = newComment.substring(0, lastAtIndex);
    const newText = textBeforeAt + `@${user.first_name} ${user.last_name}` + ' ';
    setNewComment(newText);
    setShowMentionPopover(false);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [newComment]);

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

  useEffect(() => { loadComments(); }, [loadComments]);

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
        fetchQuestions().then((r) => setQuestions(r.questions)).catch(console.error);
        setComments(prev => [...prev, result.comment]);
        setNewComment("");
      } else {
        alert("Failed to post comment. Please try again.");
      }
    } catch {
      alert("An error occurred while posting your comment.");
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, questionId, loggedIn.id, setQuestions]);

  const handleLikeComment = useCallback(async (commentId: string) => {
    const wasLiked = likedComments.has(commentId);
    const newLiked = new Set(likedComments);
    if (wasLiked) {
      newLiked.delete(commentId);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes - 1 } : c));
    } else {
      newLiked.add(commentId);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    }
    setLikedComments(newLiked);
    try {
      const result = await toggleCommentLike(commentId, loggedIn.id);
      if (!result.success) {
        if (wasLiked) newLiked.add(commentId); else newLiked.delete(commentId);
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: wasLiked ? c.likes + 1 : c.likes - 1 } : c));
        setLikedComments(new Set(newLiked));
      }
    } catch { /* optimistic rollback handled above */ }
  }, [likedComments, loggedIn.id]);

  const handleEditComment = useCallback(async (commentId: string, newContent: string) => {
    const original = comments.find(c => c.id === commentId);
    if (!original) return;
    const newUpdatedAt = new Date().toISOString();
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: newContent, updated_at: newUpdatedAt } : c));
    try {
      const result = await updateComment({ comment_id: commentId, comment: newContent });
      if (!result.success) {
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: original.content, updated_at: original.updated_at } : c));
        alert("Failed to update comment. Please try again.");
      } else if (result.comment) {
        setComments(prev => prev.map(c => c.id === commentId ? result.comment! : c));
      }
    } catch {
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: original.content, updated_at: original.updated_at } : c));
    }
  }, [comments]);

  const handleDeleteComment = useCallback((commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!commentToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteComment(commentToDelete);
      if (result.success) {
        setComments(prev => prev.filter(c => c.id !== commentToDelete));
        fetchQuestions().then((r) => setQuestions(r.questions)).catch(console.error);
        setDeleteModalOpen(false);
        setCommentToDelete(null);
      } else {
        alert("Failed to delete comment. Please try again.");
      }
    } catch {
      alert("An error occurred while deleting your comment.");
    } finally {
      setIsDeleting(false);
    }
  }, [commentToDelete, setQuestions]);

  const cancelDelete = useCallback(() => {
    if (isDeleting) return;
    setDeleteModalOpen(false);
    setCommentToDelete(null);
  }, [isDeleting]);

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open && isDeleting) return;
    setDeleteModalOpen(open);
    if (!open) setCommentToDelete(null);
  }, [isDeleting]);

  // ─── Mark as Solution ──────────────────────────────────────────────────────
  const handleMarkSolution = useCallback(async (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const wasMarked = comment.marked_as_solution;

    // Optimistic update
    setComments(prev => prev.map(c => ({
      ...c,
      // If we're marking this one → clear all others
      // If we're unmarking this one → just toggle it off
      marked_as_solution: wasMarked
        ? (c.id === commentId ? false : c.marked_as_solution)
        : (c.id === commentId ? true : false),
    })));

    try {
      const result = await markAsSolution(commentId, questionId);
      if (result.success) {
        onSolutionMarked?.(); // ← add this
      } else{
        // Rollback
        setComments(prev => prev.map(c => ({
          ...c,
          marked_as_solution: c.id === commentId ? wasMarked : c.marked_as_solution,
        })));
        alert("Failed to update solution. Please try again.");
      }
    } catch {
      setComments(prev => prev.map(c => ({
        ...c,
        marked_as_solution: c.id === commentId ? wasMarked : c.marked_as_solution,
      })));
    }
  }, [comments, questionId]);

  if (isLoading) return <LoadingState />;

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
            <Button variant="ghost" onClick={cancelDelete} disabled={isDeleting} className="text-xs sm:text-sm h-9">
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
              questionAuthorId={questionAuthorId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onMarkSolution={handleMarkSolution}
            />
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-2 sm:space-y-3">
        <div className="relative">
          <MentionPopover
            isOpen={showMentionPopover}
            users={mentionUsers}
            isLoading={isSearching}
            onSelectUser={handleSelectMentionUser}
            onClose={() => setShowMentionPopover(false)}
          />
          <Textarea
            ref={textareaRef}
            placeholder="Write a helpful comment... (use @ to mention someone)"
            value={newComment}
            onChange={(e) => handleCommentChange(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            className="resize-none text-sm border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-customBlue-400"
          />
        </div>
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

