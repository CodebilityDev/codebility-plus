"use client";

import type { PostType } from "../_services/query";

interface PostTagsProps {
  post: PostType;
  minimal?: boolean;
}

export default function PostTags({ post, minimal = false }: PostTagsProps) {
  const tags = post.tags ?? [];

  if (!tags.length && !minimal) return null;

  // Determine which tags to display
  const displayTags = minimal ? tags.slice(0, 3) : tags;
  const hiddenCount = minimal ? tags.length - displayTags.length : 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayTags.map((tag) => (
        <span
          key={tag.tag_id}
          className="
            flex h-6
            items-center gap-2 rounded-md border
            border-gray-300 bg-gray-50 px-2 text-xs text-gray-500
            shadow-sm  dark:border-gray-600
            dark:bg-gray-700 dark:text-gray-400
          "
        >
          {tag.name}
        </span>
      ))}

      {hiddenCount > 0 ? (
        <span
          className="
            flex h-6
            items-center gap-2 rounded-md border
            border-gray-300 bg-gray-50 px-2 text-xs text-gray-500
            shadow-sm  dark:border-gray-600
            dark:bg-gray-700 dark:text-gray-400
          "
        >
          +{hiddenCount} more
        </span>
      ) : minimal && !tags.length ? (
        <span
          className="
            flex h-6
            items-center gap-2 rounded-md border
            border-gray-300 bg-gray-50 px-2 text-xs text-gray-500
            opacity-0  shadow-sm
            dark:border-gray-600 dark:bg-gray-700
            dark:text-gray-400
          "
        >
          placeholder
        </span>
      ) : null}
    </div>
  );
}
