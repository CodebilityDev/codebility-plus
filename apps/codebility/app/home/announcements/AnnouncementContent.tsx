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
    <div className="space-y-8">
      {/* Banner Image - Fixed for now, will be editable in future */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
        <Image
          src={page.banner_image}
          alt={page.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      {/* Title */}
      <div>
        <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          {page.title}
        </h3>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Last updated: {new Date(page.last_updated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

     <div className="prose prose-lg dark:prose-invert max-w-none">
        <div 
          className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
        </div>
      </div>
  );
};