"use client";

import { useEffect, useState } from "react";
import CreatePostModal from "@/components/modals/CreatePostModal";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";

import Feed from "./_components/Feed";
import SocialPointsCard from "./_components/SocialPointsCard";
import SortMenu from "./_components/SortMenu";
import { SEARCH_DEBOUNCE_MS } from "./_constants";
import { getUserRole, hasNotPostedYet, hasReachedDailyPostLimit } from "./_services/action";
import toast from "react-hot-toast";
import FirstPostPrompt from "./_components/FirstPostPrompt";
import { PlusCircle } from "lucide-react";

type SortField = "title" | "date" | "upvotes";
type SortOrder = "asc" | "desc";

export default function FeedsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [userHasNotPostedYet, setUserHasNotPostedYet] = useState(false);
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
    if (!user) return;

    const checkIfUserHasPosted = async () => {
      try {
        const result = await hasNotPostedYet(user.id);
        setUserHasNotPostedYet(result);
      } catch (error) {
        console.error(error);
      }
    };

  checkIfUserHasPosted();
  }, [user]);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedQuery(searchQuery),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const openModal = async () => {
    if (!user) return;

    try {
      const unallowed = await hasReachedDailyPostLimit(user.id);

      if (unallowed) {
        toast.error("Daily post limit reached. You’re not allowed to create a post right now.");
        return;
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to check posting permission", error);
    }
  };
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

        <SocialPointsCard />

        {userHasNotPostedYet && (
          <div className="mb-4">
          <FirstPostPrompt onCreatePost={openModal}/> 
        </div>
        )}

        {!userHasNotPostedYet && (
          <Button
            onClick={openModal}
            className="gap-2 w-auto mb-4"
          >
            <PlusCircle className="h-5 w-5" />
            Create Post
          </Button>
        )}

        {/* Search bar + sort button row */}
        <div className="relative mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by title or author name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:border-customBlue-500 focus:ring-customBlue-500 h-11 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />

          <SortMenu
            sortField={sortField}
            sortOrder={sortOrder}
            onChangeSortField={setSortField}
            onChangeSortOrder={setSortOrder}
          />
        </div>

        <Feed
          isAdmin={isAdmin}
          searchQuery={debouncedQuery}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
