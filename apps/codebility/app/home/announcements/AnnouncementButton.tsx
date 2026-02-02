"use client";

import React, { useState } from "react";
import { Megaphone } from "lucide-react";
import { AnnouncementModal } from "./AnnouncementModal";

export const AnnouncementButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        aria-label="View announcements"
        title="Announcements"
      >
        <Megaphone className="h-5 w-5" />
      </button>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};