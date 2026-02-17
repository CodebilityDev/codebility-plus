"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { createComment, searchUsers } from "../_services/action";
import { PostType } from "../_services/query";
import { UserMention } from "../_services/types";

interface CreateCommentProps {
  post: PostType;
  onCommentCreated?: () => void;
}

export default function PostViewCreateComment({
  post,
  onCommentCreated,
}: CreateCommentProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();

  // Mention-related state
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionUsers, setMentionUsers] = useState<UserMention[]>([]);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentionStartPos, setMentionStartPos] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search for users when mention search changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!mentionSearch || mentionSearch.length < 1) {
        setMentionUsers([]);
        return;
      }

      setIsSearching(true);
      try {
        const users = await searchUsers(mentionSearch);
        setMentionUsers(users);
        setSelectedMentionIndex(0);
      } catch {
        setMentionUsers([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchUsers, 200);
    return () => clearTimeout(debounceTimer);
  }, [mentionSearch]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowMentionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    setComment(value);

    // Detect @ mention
    const beforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = beforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const textAfterAt = beforeCursor.slice(lastAtIndex + 1);
      // Check if there's a space after @ (which would end the mention)
      if (!textAfterAt.includes(" ") && textAfterAt.length >= 0) {
        setMentionStartPos(lastAtIndex);
        setMentionSearch(textAfterAt);
        setShowMentionDropdown(true);
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  const insertMention = (mentionedUser: UserMention) => {
    if (mentionStartPos === null) return;

    const beforeMention = comment.slice(0, mentionStartPos);
    const afterMention = comment.slice(mentionStartPos + mentionSearch.length + 1);
    const newComment = `${beforeMention}@${mentionedUser.username} ${afterMention}`;

    setComment(newComment);
    setShowMentionDropdown(false);
    setMentionStartPos(null);
    setMentionSearch("");

    // Focus back on input
    setTimeout(() => {
      inputRef.current?.focus();
      const newCursorPos = beforeMention.length + mentionedUser.username.length + 2;
      inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle mention dropdown navigation
    if (showMentionDropdown && mentionUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev < mentionUsers.length - 1 ? prev + 1 : 0
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) =>
          prev > 0 ? prev - 1 : mentionUsers.length - 1
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const selectedUser = mentionUsers[selectedMentionIndex];
        if (selectedUser) {
          insertMention(selectedUser);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentionDropdown(false);
        return;
      }
    }

    // Handle comment submission
    if (e.key === "Enter" && comment.trim() && !isSubmitting && !showMentionDropdown) {
      if (!user || !user.id) return;

      if (!post?.id) {
        alert("Error: Post data is missing. Please refresh the page and try again.");
        return;
      }

      if (post.id === "00000000-0000-0000-0000-000000000001") {
        alert("Error: Invalid post. Please refresh the page and try again.");
        return;
      }

      try {
        setIsSubmitting(true);

        // Extract mentioned usernames from comment
        const mentionRegex = /@(\w+)/g;
        const mentions = [...comment.matchAll(mentionRegex)]
          .map((match) => match[1])
          .filter((mention): mention is string => !!mention);

        await createComment(post.id, user.id, comment, mentions);

        setComment("");
        onCommentCreated?.();

        // Update comment count
        const currentPost = useFeedsStore
          .getState()
          .posts.find((p) => p.id === post.id);
        if (currentPost) {
          useFeedsStore.getState().updatePost(post.id, {
            comment_count: (currentPost.comment_count ?? 0) + 1,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Failed to post comment: ${error.message}`);
        } else {
          alert("Failed to post comment. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="relative flex items-center gap-3 p-2">
      <Image
        src={user?.image_url || defaultAvatar}
        alt="User avatar"
        width={36}
        height={36}
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          className={`w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white ${
            isSubmitting
              ? "cursor-not-allowed opacity-50"
              : "focus:border-gray-500"
          }`}
        />

        {/* Mention Autocomplete Dropdown */}
        {showMentionDropdown && (
          <div
            ref={dropdownRef}
            className="absolute bottom-full left-0 z-50 mb-2 w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            {isSearching ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            ) : mentionUsers.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {mentionUsers.map((mentionUser, index) => (
                  <button
                    key={mentionUser.id}
                    onClick={() => insertMention(mentionUser)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      index === selectedMentionIndex
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Image
                      src={mentionUser.image_url || defaultAvatar}
                      alt={mentionUser.username}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          {mentionUser.first_name} {mentionUser.last_name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{mentionUser.username}
                        </span>
                      </div>
                      {mentionUser.headline && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {mentionUser.headline}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : mentionSearch.length > 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No users found
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}