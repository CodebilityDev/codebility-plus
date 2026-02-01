"use client";

import React from "react";
import Image from "next/image";
import { AnnouncementPage } from "./types";

interface AnnouncementContentProps {
  page: AnnouncementPage;
}

export const AnnouncementContent: React.FC<AnnouncementContentProps> = ({
  page,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Banner Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
        <Image
          src={page.banner_image}
          alt={page.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 800px"
          priority
        />
      </div>

      {/* Title */}
      <div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {page.title}
        </h3>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Last updated:{" "}
          {new Date(page.last_updated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none">
        <div
          className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
};