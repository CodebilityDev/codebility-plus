"use client";

import { useEffect, useState } from "react";
import CreatePostModal from "@/components/modals/CreatePostModal";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { ChevronDown } from "lucide-react";

import Feed from "./_components/Feed";
import SocialPointsCard from "./_components/SocialPointsCard";
import { getUserRole } from "./_services/action";

type SortField = "title" | "date" | "upvotes";
type SortOrder = "asc" | "desc";

export default function FeedsPage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
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
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
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

        <SocialPointsCard />

        <Button className="mb-4 mt-4 w-auto" onClick={openModal}>
          Create Post
        </Button>

        {/* Search bar + sort button row */}
        <div className="relative mb-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by title or author name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus:border-customBlue-500 focus:ring-customBlue-500 h-11 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />

          <div className="relative">
            <button
              onClick={() => setSortMenuOpen((prev) => !prev)}
              className="flex h-11 items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Sort:{" "}
              <span className="capitalize">
                {sortField} ({sortOrder})
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${sortMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {sortMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:shadow-black/20">
                {["date", "title", "upvotes", "comments"].map((field) => (
                  <button
                    key={field}
                    onClick={() => {
                      setSortField(field as SortField);
                      setSortMenuOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 ${
                      sortField === field ? "text-gray-900 dark:text-white" : ""
                    }`}
                  >
                    Sort by {field}
                  </button>
                ))}
                <div className="border-t border-gray-200 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Order:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSortOrder("asc")}
                        className={`rounded px-2 py-1 ${
                          sortOrder === "asc"
                            ? "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        Asc
                      </button>
                      <button
                        onClick={() => setSortOrder("desc")}
                        className={`rounded px-2 py-1 ${
                          sortOrder === "desc"
                            ? "bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        Desc
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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
