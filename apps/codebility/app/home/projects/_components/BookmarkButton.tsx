import React, { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

import { updatePublicDisplaySwitch } from "../actions";
import { ProjectCardProps } from "./ProjectCard";

export default function BookmarkButton({
  project,
  onOpen,
  categoryId,
}: ProjectCardProps) {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    project.public_display,
  );
  const [loading, setLoading] = useState<boolean>(false);

  /*   const handlePublicDisplay = async (e: React.MouseEvent): Promise<void> => {
      setLoading(true);
      const { id } = e.currentTarget;
      e.stopPropagation();
      try {
        setPublicDisplay(!publicDisplay);
        await updatePublicDisplaySwitch(!publicDisplay, id);
      } catch (error) {
        console.error("Error updating public display:", error);
      } finally {
        setLoading(false);
      }
    }; */

  const handleBookmark = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation(); // Prevent triggering parent click events
    setLoading(true);

    try {
      const { id } = e.currentTarget;

      setIsBookmarked(!isBookmarked);
      // Call the API to update the public display status
      await updatePublicDisplaySwitch(!isBookmarked, id);
    } catch (error) {
      console.error("Error updating bookmark:", error);
      // Revert state on error
      setIsBookmarked(!isBookmarked);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id={project.id}
      onClick={handleBookmark}
      disabled={loading}
      className="group flex items-center justify-center rounded-full border border-white/20 bg-white/80 p-1 shadow-lg backdrop-blur-sm transition-all hover:scale-125 hover:bg-white/90 disabled:opacity-50"
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      {isBookmarked ? (
        <svg
          className="size-8 drop-shadow-sm transition-all group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="bookmarkGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#37bfde" />
            </linearGradient>
          </defs>
          <path
            d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
            fill="url(#bookmarkGradient)"
            stroke="url(#bookmarkGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <Bookmark className="dark:text-gray size-8 fill-purple-100 text-gray-600 drop-shadow-sm transition-all group-hover:text-purple-500" />
      )}
    </button>
  );
}
