"use client";

import { useEffect, useState } from "react";
import CreatePostModal from "@/components/modals/CreatePostModal";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { MessageSquareText } from "lucide-react";

import Feed from "./_components/Feed";
import { getUserRole } from "./_services/action";

export default function FeedsPage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const role = await getUserRole(user.role_id ?? null);
      setIsAdmin(role === "Admin");
    };

    if (user) {
      fetchRole();
    }
  }, [user]);

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
        {/* Social Points Card*/}
        <div className="dark:bg-white/3 relative mt-4 w-full rounded-xl border border-white/10 bg-gray-800 p-4 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 xl:fixed xl:right-6 xl:top-20 xl:z-50 xl:mt-0 xl:w-64">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 transition-opacity hover:opacity-10 xl:rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 transition-opacity hover:opacity-10" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2 text-white">
                  <MessageSquareText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    Social Points
                  </p>
                  <p className="text-xs text-gray-500">Feed Engagement</p>
                </div>
              </div>
              <div className="text-right">
                <p className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">
                  {10}
                </p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Earn more points by posting and getting likes and comments!
              </p>
            </div>
          </div>
        </div>

        <Button className="mb-4 mt-4 w-auto" onClick={openModal}>
          Create Post
        </Button>

        <Feed isAdmin={isAdmin} />
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
