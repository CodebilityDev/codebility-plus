"use client";

import { useState, useEffect, memo, useCallback, useRef } from "react";
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
// User interface for mentions
interface MentionUser {
  id: string;
  name: string;
  username: string;
  image_url: string | null;
}

// Utility function to extract mentions from text
const extractMentions = (text: string): string[] => {
  // allow usernames containing letters, numbers, dots, underscores and hyphens
  const mentionPattern = /@([A-Za-z0-9._-]+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionPattern.exec(text)) !== null) {
    mentions.push(match[1].toLowerCase()); // normalize to lower-case for matching
  }
  return [...new Set(mentions)]; // Remove duplicates
};

// Utility function to format comment text with clickable links, mentions, and preserved formatting
// Accepts optional `users` so mentions can be displayed using the user's full handle when resolvable
const formatCommentText = (text: string, users?: MentionUser[]): JSX.Element => {
  // URL regex pattern (no global flag — safer for repeated .test calls)
  const urlPattern = /(https?:\/\/[^\s]+)/;
  // Mention regex pattern: allow letters, numbers, dots, underscores and hyphens
  const mentionPattern = /(@[A-Za-z0-9._-]+)/;

  // Split text by newlines first to preserve line breaks
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, lineIndex) => {
        // Split each line by URLs and mentions
        const parts = line.split(urlPattern).flatMap(part => part.split(mentionPattern));

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

              // Check if this part is a mention
              if (mentionPattern.test(part)) {
                const mentionKey = part.slice(1).toLowerCase(); // strip '@' and normalize

                // If users list provided, try to resolve to a full username
                let displayText = part; // fallback to original mention
                if (users && users.length > 0) {
                  const matched = users.find(u =>
                    u.username.toLowerCase() === mentionKey ||
                    u.username.toLowerCase().startsWith(mentionKey) ||
                    u.name.toLowerCase().startsWith(mentionKey)
                  );
                  if (matched) {
                    // show full handle as the highlighted text (user requested full username display)
                    displayText = `@${matched.username}`;
                  }
                }

                return (
                  <span
                    key={partIndex}
                    className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded dark:bg-blue-900 dark:text-blue-200 font-medium"
                    title={displayText}
                    data-mention={displayText}
                  >
                    {displayText}
                  </span>
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

const MentionDropdown = memo(function MentionDropdown({
  users,
  onSelect,
  onClose,
  position,
  id = "mention-dropdown",
  highlightedIndex = -1,
}: {
  users: MentionUser[];
  onSelect: (user: MentionUser) => void;
  onClose: () => void;
  position: { top: number; left: number; width: number };
  id?: string;
  highlightedIndex?: number;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (users.length === 0) return null;

  return (
    <div
      ref={dropdownRef}
      id={id}
      role="listbox"
      aria-label="Mention suggestions"
      className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto dark:bg-gray-800 dark:border-gray-600"
      style={{ top: position.top, left: position.left, width: position.width }}
    >
      {users.map((user, index) => (
        <button
          key={user.id}
          role="option"
          id={`${id}-option-${index}`}
          aria-selected={index === highlightedIndex}
          tabIndex={-1}
          onClick={() => onSelect(user)}
          className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${index === highlightedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
        >
          {user.image_url ? (
            <Image
              src={user.image_url}
              alt={user.name}
              width={24}
              height={24}
              className="rounded-full"
              objectFit="cover"
            />
          ) : (
            <DefaultAvatar size={24} />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              @{user.username}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
});

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
  users,
}: {
  reply: TaskComment;
  currentUserId: string;
  onEdit: (id: string, content: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  users: MentionUser[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Mention state for edit
  const [showEditMentionDropdown, setShowEditMentionDropdown] = useState(false);
  const [editMentionQuery, setEditMentionQuery] = useState("");
  const [editMentionPosition, setEditMentionPosition] = useState({ top: 0, left: 0, width: 200 });
  const [editFilteredUsers, setEditFilteredUsers] = useState<MentionUser[]>([]);
  
  // Ref for edit textarea and wrapper (used for proper dropdown positioning)
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editWrapperRef = useRef<HTMLDivElement>(null);
  
  const isOwner = reply.author_id === currentUserId;
  const isEdited = reply.created_at !== reply.updated_at;

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditContent(reply.content);
    setDropdownOpen(false);
    setShowEditMentionDropdown(false);
    setEditMentionQuery("");
  }, [reply.content]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditContent(reply.content);
    setShowEditMentionDropdown(false);
    setEditMentionQuery("");
  }, [reply.content]);

  const handleSaveEdit = useCallback(() => {
    if (editContent.trim() && editContent !== reply.content) {
      onEdit(reply.id, editContent.trim());
    }
    setIsEditing(false);
    setShowEditMentionDropdown(false);
    setEditMentionQuery("");
  }, [reply.id, reply.content, editContent, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(reply.id);
    setDropdownOpen(false);
  }, [reply.id, onDelete]);

  // Mention handlers for edit
  const handleEditMentionInput = useCallback((value: string, textarea: HTMLTextAreaElement) => {
    if (!users) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    // allow dots, underscores and hyphens in username queries
    const mentionMatch = textBeforeCursor.match(/@([A-Za-z0-9._-]*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1] || '';
      setEditMentionQuery(query);
      setEditFilteredUsers(
        users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
      );

      // Calculate position relative to the wrapper if available
      const textareaRect = textarea.getBoundingClientRect();
      const wrapperRect = editWrapperRef.current?.getBoundingClientRect();
      const top = wrapperRect ? textareaRect.bottom - wrapperRect.top + 5 : textareaRect.bottom + 5;
      const left = wrapperRect ? textareaRect.left - wrapperRect.left : textareaRect.left;
      const width = textareaRect.width || 200;

      setEditMentionPosition({
        top: Math.max(0, top),
        left: Math.max(0, left),
        width
      });
      setShowEditMentionDropdown(true);
    } else {
      setShowEditMentionDropdown(false);
    }

    setEditContent(value);
  }, [users]);

  const handleEditMentionSelect = useCallback((user: MentionUser | undefined) => {
    if (!user) return;
    const textarea = editTextareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = editContent.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1) {
      const beforeAt = editContent.substring(0, atIndex);
      const afterCursor = editContent.substring(cursorPosition);
      const mention = `@${user.username}`;

      // If the user typed a multi-word name before selecting, strip the
      // trailing name words that follow the cursor so only @username remains
      const typedFragment = editContent.substring(atIndex, cursorPosition);
      let trimmedAfter = afterCursor;
      const trailingNameMatch = afterCursor.match(/^(\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+)?)/);
      if (/\s/.test(typedFragment) && trailingNameMatch) {
        trimmedAfter = afterCursor.substring(trailingNameMatch[0].length);
      }

      const newText = beforeAt + mention + ' ' + trimmedAfter;

      setEditContent(newText);
      setShowEditMentionDropdown(false);
      setEditMentionQuery("");

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(atIndex + mention.length + 1, atIndex + mention.length + 1);
      }, 0);
    }
  }, [editContent, editMentionQuery]);

  const handleEditTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    handleEditMentionInput(value, e.target);
  }, [handleEditMentionInput]);

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
            objectFit="cover"
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
          <div className="space-y-2 relative" ref={editWrapperRef}>
            <Textarea
              ref={editTextareaRef}
              value={editContent}
              onChange={handleEditTextareaChange}
              onKeyDown={(e) => {
                if (!showEditMentionDropdown || editFilteredUsers.length === 0) {
                  if (e.key === 'Escape') setShowEditMentionDropdown(false);
                  return;
                }

                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setEditHighlightedIndex(i => (i + 1) % editFilteredUsers.length);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setEditHighlightedIndex(i => (i - 1 + editFilteredUsers.length) % editFilteredUsers.length);
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEditMentionSelect(editFilteredUsers[editHighlightedIndex || 0]);
                } else if (e.key === 'Escape') {
                  setShowEditMentionDropdown(false);
                }
              }}
              aria-controls={`reply-edit-mention-${reply.id}`}
              aria-activedescendant={showEditMentionDropdown && editFilteredUsers[editHighlightedIndex] ? `reply-edit-mention-${reply.id}-option-${editHighlightedIndex}` : undefined}
              rows={3}
              className="resize-none border-gray-300 bg-white text-sm sm:text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              autoFocus
            />
            {showEditMentionDropdown && editFilteredUsers.length > 0 && (
              <MentionDropdown
                users={editFilteredUsers}
                position={editMentionPosition}
                onSelect={handleEditMentionSelect}
                onClose={() => setShowEditMentionDropdown(false)}
                id={`reply-edit-mention-${reply.id}`}
                highlightedIndex={editHighlightedIndex}
              />
            )}
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
            {formatCommentText(reply.content, users)}
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
  users,
}: {
  comment: TaskComment;
  currentUserId: string;
  onEdit: (id: string, content: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onReply: (parentId: string, content: string) => void | Promise<void>;
  users: MentionUser[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(true);
  
  // Mention state for reply
  const [showReplyMentionDropdown, setShowReplyMentionDropdown] = useState(false);
  const [replyMentionQuery, setReplyMentionQuery] = useState("");
  const [replyMentionPosition, setReplyMentionPosition] = useState({ top: 0, left: 0, width: 200 });
  const [replyFilteredUsers, setReplyFilteredUsers] = useState<MentionUser[]>([]);
  const [replyHighlightedIndex, setReplyHighlightedIndex] = useState(0);
  
  // Mention state for edit
  const [showEditMentionDropdown, setShowEditMentionDropdown] = useState(false);
  const [editMentionQuery, setEditMentionQuery] = useState("");
  const [editMentionPosition, setEditMentionPosition] = useState({ top: 0, left: 0, width: 200 });
  const [editFilteredUsers, setEditFilteredUsers] = useState<MentionUser[]>([]);
  const [editHighlightedIndex, setEditHighlightedIndex] = useState(0);
  const editWrapperRefForComment = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReplyHighlightedIndex(0);
  }, [replyFilteredUsers]);

  useEffect(() => {
    setEditHighlightedIndex(0);
  }, [editFilteredUsers]);
  

  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  
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

  // Handle mention input for reply
  // ref for the reply input wrapper (used to position dropdown relative to this element)
  const replyInputWrapperRef = useRef<HTMLDivElement>(null);

  const handleReplyMentionInput = useCallback((value: string, textarea: HTMLTextAreaElement) => {
    if (!users) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ' || textBeforeCursor[atIndex - 1] === '\n')) {
      const query = textBeforeCursor.substring(atIndex + 1);
      if (query.length >= 0) {
        const filtered = users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
          const textareaRect = textarea.getBoundingClientRect();
          const wrapperRect = replyInputWrapperRef.current?.getBoundingClientRect();
          const top = wrapperRect ? textareaRect.bottom - wrapperRect.top + 5 : textareaRect.bottom + 5;
          const left = wrapperRect ? textareaRect.left - wrapperRect.left : textareaRect.left;
          const width = textareaRect.width;

          setReplyMentionPosition({ top, left, width });
          setReplyFilteredUsers(filtered);
          setReplyMentionQuery(query);
          setShowReplyMentionDropdown(true);
          return;
        }
      }
    }
    setShowReplyMentionDropdown(false);
  }, [users]);

  const handleReplyMentionSelect = useCallback((user: MentionUser) => {
    const textarea = replyTextareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = replyContent.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1) {
      const beforeAt = replyContent.substring(0, atIndex);
      const afterCursor = replyContent.substring(cursorPosition);
      const mention = `@${user.username}`;

      // Remove trailing typed last-name fragment when user had typed a space in the mention
      const typedFragment = replyContent.substring(atIndex, cursorPosition);
      let trimmedAfter = afterCursor;
      const trailingNameMatch = afterCursor.match(/^(\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+)?)/);
      if (/\s/.test(typedFragment) && trailingNameMatch) {
        trimmedAfter = afterCursor.substring(trailingNameMatch[0].length);
      }

      const newText = beforeAt + mention + ' ' + trimmedAfter;

      setReplyContent(newText);
      setShowReplyMentionDropdown(false);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(atIndex + mention.length + 1, atIndex + mention.length + 1);
      }, 0);
    }
  }, [replyContent]);

  const handleReplyTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setReplyContent(value);
    handleReplyMentionInput(value, e.target);
  }, [handleReplyMentionInput]);

  // Handle mention input for editing
  const handleEditMentionInput = useCallback((value: string, textarea: HTMLTextAreaElement) => {
    if (!users) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ' || textBeforeCursor[atIndex - 1] === '\n')) {
      const query = textBeforeCursor.substring(atIndex + 1);
      if (query.length >= 0) {
        const filtered = users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
          const textareaRect = textarea.getBoundingClientRect();
          const wrapperRect = editWrapperRefForComment.current?.getBoundingClientRect();

          const top = wrapperRect ? textareaRect.bottom - wrapperRect.top + 5 : textareaRect.bottom + 5;
          const left = wrapperRect ? textareaRect.left - wrapperRect.left : textareaRect.left;
          const width = textareaRect.width;

          setEditMentionPosition({ top, left, width });
          setEditFilteredUsers(filtered);
          setEditMentionQuery(query);
          setShowEditMentionDropdown(true);
          return;
        }
      }
    }
    setShowEditMentionDropdown(false);
  }, [users]);

  const handleEditMentionSelect = useCallback((user: MentionUser) => {
    const textarea = editTextareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = editContent.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1) {
      const beforeAt = editContent.substring(0, atIndex);
      const afterCursor = editContent.substring(cursorPosition);
      const mention = `@${user.username}`;
      const newText = beforeAt + mention + ' ' + afterCursor;

      setEditContent(newText);
      setShowEditMentionDropdown(false);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(atIndex + mention.length + 1, atIndex + mention.length + 1);
      }, 0);
    }
  }, [editContent]);

  const handleEditTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditContent(value);
    handleEditMentionInput(value, e.target);
  }, [handleEditMentionInput]);

  const handleSubmitReply = useCallback(() => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setIsReplying(false);
      setReplyContent("");
      setShowReplyMentionDropdown(false);
      setReplyMentionQuery("");
    }
  }, [replyContent, onReply, comment.id]);

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
              objectFit="cover"
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
              <div className="space-y-2 relative" ref={editWrapperRefForComment}>
                <Textarea
                  ref={editTextareaRef}
                  value={editContent}
                  onChange={handleEditTextareaChange}
                  onKeyDown={(e) => {
                    if (!showEditMentionDropdown || editFilteredUsers.length === 0) {
                      if (e.key === 'Escape') setShowEditMentionDropdown(false);
                      return;
                    }

                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setEditHighlightedIndex(i => (i + 1) % editFilteredUsers.length);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setEditHighlightedIndex(i => (i - 1 + editFilteredUsers.length) % editFilteredUsers.length);
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEditMentionSelect(editFilteredUsers[editHighlightedIndex || 0]);
                    } else if (e.key === 'Escape') {
                      setShowEditMentionDropdown(false);
                    }
                  }}
                  aria-controls={`edit-mention-${comment.id}`}
                  aria-activedescendant={showEditMentionDropdown && editFilteredUsers[editHighlightedIndex] ? `edit-mention-${comment.id}-option-${editHighlightedIndex}` : undefined}
                  rows={3}
                  className="resize-none border-gray-300 bg-white text-sm sm:text-base text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
                {showEditMentionDropdown && (
                  <MentionDropdown
                    users={editFilteredUsers}
                    onSelect={handleEditMentionSelect}
                    onClose={() => setShowEditMentionDropdown(false)}
                    position={editMentionPosition}
                    id={`edit-mention-${comment.id}`}
                    highlightedIndex={editHighlightedIndex}
                  />
                )}
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
                {formatCommentText(comment.content, users)}
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
            <div className="mt-2 ml-3 space-y-2 relative" ref={replyInputWrapperRef}>
              <Textarea
                ref={replyTextareaRef}
                placeholder="Write a reply..."
                value={replyContent}
                onChange={handleReplyTextareaChange}
                onKeyDown={(e) => {
                  if (!showReplyMentionDropdown || replyFilteredUsers.length === 0) {
                    if (e.key === 'Escape') setShowReplyMentionDropdown(false);
                    return;
                  }

                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setReplyHighlightedIndex(i => (i + 1) % replyFilteredUsers.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setReplyHighlightedIndex(i => (i - 1 + replyFilteredUsers.length) % replyFilteredUsers.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    handleReplyMentionSelect(replyFilteredUsers[replyHighlightedIndex || 0]);
                  } else if (e.key === 'Escape') {
                    setShowReplyMentionDropdown(false);
                  }
                }}
                aria-controls={`reply-mention-${comment.id}`}
                aria-activedescendant={showReplyMentionDropdown && replyFilteredUsers[replyHighlightedIndex] ? `reply-mention-${comment.id}-option-${replyHighlightedIndex}` : undefined}
                rows={2}
                className="resize-none text-sm border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              {showReplyMentionDropdown && (
                <MentionDropdown
                  users={replyFilteredUsers}
                  onSelect={handleReplyMentionSelect}
                  onClose={() => setShowReplyMentionDropdown(false)}
                  position={replyMentionPosition}
                  id={`reply-mention-${comment.id}`}
                  highlightedIndex={replyHighlightedIndex}
                />
              )}
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
                  users={users}
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

  // Mention related state
  const [users, setUsers] = useState<MentionUser[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0, width: 200 });
  const [filteredUsers, setFilteredUsers] = useState<MentionUser[]>([]);
  const [mentionHighlightedIndex, setMentionHighlightedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [currentUserName, setCurrentUserName] = useState("");

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

  
  const organizeComments = (allComments: TaskComment[]): TaskComment[] => {
    const commentMap = new Map<string, TaskComment>();
    const topLevelComments: TaskComment[] = [];

    
    allComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    
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

  // Fetch users for mentions
  const fetchUsers = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("codev")
        .select("id, first_name, last_name, username, email_address, image_url")
        .order("first_name");

      if (error) throw error;

      if (data) {
        const mentionUsers: MentionUser[] = data.map(user => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`.trim(),
          // prefer the dedicated username column; fallback to first_name if missing
          username: (user.username || user.first_name).toString(),
          image_url: user.image_url,
        }));
        setUsers(mentionUsers);

        // Set current user name
        const currentUser = data.find(user => user.id === currentUserId);
        if (currentUser) {
          setCurrentUserName(`${currentUser.first_name} ${currentUser.last_name}`.trim());
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [supabase, currentUserId]);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  // Handle mention dropdown
  const handleMentionInput = useCallback((value: string, textarea: HTMLTextAreaElement) => {
    if (!users) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1 && (atIndex === 0 || textBeforeCursor[atIndex - 1] === ' ' || textBeforeCursor[atIndex - 1] === '\n')) {
      const query = textBeforeCursor.substring(atIndex + 1);
      if (query.length >= 0) { // Show dropdown even with empty query
        const filtered = users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
          // Calculate position relative to the form
          const formRect = formRef.current?.getBoundingClientRect();
          const textareaRect = textarea.getBoundingClientRect();
          
          if (formRect) {
            const top = textareaRect.bottom - formRect.top + 5; // Position below the textarea relative to form
            const left = textareaRect.left - formRect.left; // Align with left edge of textarea relative to form
            const width = textareaRect.width; // Match textarea width

            setMentionPosition({ top, left, width });
            setFilteredUsers(filtered);
            setMentionQuery(query);
            setMentionHighlightedIndex(0);
            setShowMentionDropdown(true);
            return;
          }
        }
      }
    }
    setShowMentionDropdown(false);
  }, [users]);

  const handleMentionSelect = useCallback((user: MentionUser) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = newComment.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1) {
      const beforeAt = newComment.substring(0, atIndex);
      const afterCursor = newComment.substring(cursorPosition);
      const mention = `@${user.username}`;

      // If user typed a multi-word display name (e.g. "@John Doe") and
      // the typed fragment between '@' and cursor contains a space,
      // remove the trailing name fragment after the cursor so we don't leave
      // the second name as plain text.
      const typedFragment = newComment.substring(atIndex, cursorPosition);
      let trimmedAfter = afterCursor;
      const trailingNameMatch = afterCursor.match(/^(\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ'’-]+)?)/);
      if (/\s/.test(typedFragment) && trailingNameMatch) {
        trimmedAfter = afterCursor.substring(trailingNameMatch[0].length);
      }

      const newText = beforeAt + mention + ' ' + trimmedAfter;

      setNewComment(newText);
      setShowMentionDropdown(false);

      // Set cursor position after the mention
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(atIndex + mention.length + 1, atIndex + mention.length + 1);
      }, 0);
    }
  }, [newComment]);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);
    handleMentionInput(value, e.target);
  }, [handleMentionInput]);

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

        // Extract mentions for possible notifications / processing
        const mentions = extractMentions(data.content || newComment.trim());
        if (mentions.length > 0) {
          const mentionedUsers = users.filter(u => mentions.includes(u.username.toLowerCase()));
          if (mentionedUsers.length > 0) {
            console.debug("Mentions in new comment:", mentionedUsers.map(u => u.username));
            // TODO: create server-side notifications for these users (use createNotification server action)
          }
        }
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
  [newComment, taskId, currentUserId, supabase, users]
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

        // Extract mentions from the reply content (for notifications)
        const mentions = extractMentions(content);
        if (mentions.length > 0) {
          const mentionedUsers = users.filter(u => mentions.includes(u.username.toLowerCase()));
          if (mentionedUsers.length > 0) {
            console.debug("Mentions in reply:", mentionedUsers.map(u => u.username));
            // TODO: call server-side createNotification for each mentioned user
          }
        }
      }

      toast.success("Reply posted successfully");
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
    }
  },
  [taskId, currentUserId, supabase, users]
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

       
        const mentions = extractMentions(newContent);
        if (mentions.length > 0) {
          const mentionedUsers = users.filter(u => mentions.includes(u.username.toLowerCase()));
          if (mentionedUsers.length > 0) {
            console.debug("Mentions in edited comment:", mentionedUsers.map(u => u.username));
            
          }
        }
      }

      toast.success("Comment updated successfully");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  },
  [supabase, users]
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
              users={users}
            />
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmitComment} className="space-y-2 sm:space-y-3 relative">
        <Textarea
          ref={textareaRef}
          placeholder="Write a comment..."
          value={newComment}
          onChange={handleTextareaChange}
          onKeyDown={(e) => {
            if (!showMentionDropdown || filteredUsers.length === 0) {
              if (e.key === 'Escape') setShowMentionDropdown(false);
              return;
            }

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setMentionHighlightedIndex(i => (i + 1) % filteredUsers.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setMentionHighlightedIndex(i => (i - 1 + filteredUsers.length) % filteredUsers.length);
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const u = filteredUsers[mentionHighlightedIndex || 0];
              if (u) handleMentionSelect(u);
            } else if (e.key === 'Escape') {
              setShowMentionDropdown(false);
            }
          }}
          aria-controls="mention-dropdown-main"
          aria-activedescendant={showMentionDropdown && filteredUsers[mentionHighlightedIndex] ? `mention-dropdown-main-option-${mentionHighlightedIndex}` : undefined}
          aria-expanded={showMentionDropdown}
          disabled={isSubmitting}
          rows={3}
          className="resize-none text-sm sm:text-base border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />

        {showMentionDropdown && (
          <MentionDropdown
            users={filteredUsers}
            onSelect={handleMentionSelect}
            onClose={() => setShowMentionDropdown(false)}
            position={mentionPosition}
            id="mention-dropdown-main"
            highlightedIndex={mentionHighlightedIndex}
          />
        )}

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

export type { TaskComment };