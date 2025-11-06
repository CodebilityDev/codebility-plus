"use client";

import { useEffect, useState } from "react";
import CreatePostModal from "@/components/modals/CreatePostModal";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";

import Feed from "./_components/Feed";
import SocialPointsCard from "./_components/SocialPointsCard";
import { getUserRole } from "./_services/action";

export default function FeedsPage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const role = await getUserRole(user.role_id ?? null);
      setIsAdmin(role === "Admin");
    };

    if (user) fetchRole();
  }, [user]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // triggers after 500ms of inactivity

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-black-800 dark:text-white">
          <h1 className="text-3xl font-bold">Feeds</h1>
          <p className="mb-4 mt-4 text-gray-600 dark:text-gray-400">
            Stay updated with the latest announcements and discussions from the
            Codebility community.
          </p>
        </div>

        {/* Social Points Card */}
        <SocialPointsCard />

        <Button className="mb-4 mt-4 w-auto" onClick={openModal}>
          Create Post
        </Button>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or author name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:border-customBlue-500 focus:ring-customBlue-500 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400 h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Feed component with live search */}
        <Feed isAdmin={isAdmin} searchQuery={debouncedQuery} />
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
