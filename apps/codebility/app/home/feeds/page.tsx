"use client";

import { useEffect, useState } from "react";
import CreateFeedModal from "@/Components/modals/CreateFeedModal";
import { Button } from "@/Components/ui/button";
import { useUserStore } from "@/store/codev-store";

import Feed from "./_components/Feed";
import { getUserRole } from "./action";

export default function FeedsPage() {
  const [isMentor, setIsMentor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const role = await getUserRole(user.role_id ?? null);
      setIsMentor(role === "Mentor");
    };

    if (user) {
      fetchRole();
    }
  }, [user]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <>
      <div className="text-black-800 dark:text-white">
        <h1 className="text-3xl font-bold">Feeds</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with the latest announcements and discussions from the
          Codebility community.
        </p>
      </div>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isMentor && (
          <Button className="mb-4 w-auto" onClick={openModal}>
            Create Feeds
          </Button>
        )}
        <Feed isMentor={isMentor} />
      </div>

      <CreateFeedModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
