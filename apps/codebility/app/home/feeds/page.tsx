"use client";

import { useEffect, useRef, useState } from "react";
import CreatePostModal from "@/components/modals/CreatePostModal";
import { useUserStore } from "@/store/codev-store";
import { defaultAvatar } from "@/public/assets/images";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import Feed from "./_components/Feed";
import SortMenu from "./_components/SortMenu";
import { SEARCH_DEBOUNCE_MS } from "./_constants";
import {
  getUserRole,
  hasNotPostedYet,
  hasReachedDailyPostLimit,
  getSocialPoints,
} from "./_services/action";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Search,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  X,
} from "lucide-react";

type SortField = "title" | "date" | "upvotes" | "comments";
type SortOrder = "asc" | "desc";

export default function FeedsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [userHasNotPostedYet, setUserHasNotPostedYet] = useState(false);
  const [socialPoints, setSocialPoints] = useState<number | null>(null);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
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
    const fetchSocialPoints = async () => {
      if (!user) { setLoadingPoints(false); return; }
      setLoadingPoints(true);
      try {
        const pts = await getSocialPoints(user.id);
        setSocialPoints(pts || 0);
      } finally {
        setLoadingPoints(false);
      }
    };
    if (user) fetchSocialPoints();
  }, [user]);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedQuery(searchQuery),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Close filter drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  const openModal = async () => {
    if (!user) return;
    try {
      const unallowed = await hasReachedDailyPostLimit(user.id);
      if (unallowed) {
        toast.error("Daily post limit reached. You're not allowed to create a post right now.");
        return;
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to check posting permission", error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const cardClass =
    "rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800";

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

          {/* ── PAGE HEADER ── */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                Feeds
              </h1>
              <p className="mt-1 hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
                Stay updated with the latest announcements and discussions from the Codebility community.
              </p>
            </div>

            {/* Filter toggle button — hidden on xl (sidebar handles it) */}
            <div ref={filterRef} className="relative xl:hidden">
              <button
                onClick={() => setFilterOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition-all
                  ${filterOpen
                    ? "border-cyan-500 bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                {filterOpen
                  ? <X className="h-4 w-4" />
                  : <SlidersHorizontal className="h-4 w-4" />
                }
                <span className="hidden sm:inline">
                  {filterOpen ? "Close" : "Filters"}
                </span>
              </button>

              {/* Collapsible filter drawer */}
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:w-80"
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Search &amp; Filter
                    </p>

                    {/* Search input */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                      />
                    </div>

                    {/* Sort controls */}
                    <SortMenu
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onChangeSortField={setSortField}
                      onChangeSortOrder={setSortOrder}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex gap-6">

            {/* ── LEFT SIDEBAR — xl+ only ── */}
            <aside className="hidden w-64 flex-shrink-0 xl:flex xl:flex-col gap-4">

              {/* User Profile Card */}
              <div className={`${cardClass} p-5`}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <Image
                      src={user?.image_url || defaultAvatar}
                      alt="Profile"
                      width={72}
                      height={72}
                      className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-cyan-500/40"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : "Your Name"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    {(user as any)?.username
                      ? `@${(user as any).username}`
                      : "@username"}
                  </p>
                </div>
              </div>

              {/* Search & Filter */}
              <div className={`${cardClass} p-4`}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Search &amp; Filter
                </p>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:border-cyan-500"
                  />
                </div>
                <SortMenu
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onChangeSortField={setSortField}
                  onChangeSortOrder={setSortOrder}
                />
              </div>

              {/* Social Points Card */}
              <div className={`${cardClass} p-4`}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-2 text-white shadow-md">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Social Points
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Feed Engagement
                    </p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  {loadingPoints ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                  ) : (
                    <p className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-3xl font-bold text-transparent">
                      {socialPoints ?? 0}
                    </p>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">points</span>
                </div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Earn more by posting and getting likes &amp; comments!
                </p>
              </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="min-w-0 flex-1">

              {/* Top row: Create Post + Trending */}
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* Create Post Card */}
                <button
                  onClick={openModal}
                  className={`${cardClass} group flex flex-col items-center justify-center gap-3 px-6 py-8 text-center transition-all duration-300 hover:border-cyan-400 hover:shadow-md dark:hover:border-cyan-500/60 dark:hover:shadow-cyan-500/10`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md transition-transform duration-300 group-hover:scale-110">
                    {userHasNotPostedYet
                      ? <Sparkles className="h-6 w-6 text-white" />
                      : <PlusCircle className="h-6 w-6 text-white" />
                    }
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {userHasNotPostedYet ? "Create your first post" : "Create Post"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {userHasNotPostedYet
                        ? "Share something and earn social points 🚀"
                        : "Share something with the community"}
                    </p>
                  </div>
                </button>

                {/* Trending / Widget Card */}
                <div className={`${cardClass} flex flex-col justify-center px-6 py-8`}>
                  <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                      Trending
                    </p>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-7 w-7 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="flex-1 space-y-1">
                          <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                          <div className="h-2 w-1/2 animate-pulse rounded-full bg-gray-100 dark:bg-gray-700/60" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs italic text-gray-400 dark:text-gray-600">
                    Top users &amp; trends coming soon
                  </p>
                </div>
              </div>

              {/* Feed grid:
                  - mobile  (default) : 1 column
                  - tablet  (md)      : 2 columns
                  - desktop (xl)      : 3 columns
              */}
              <Feed
                isAdmin={isAdmin}
                searchQuery={debouncedQuery}
                sortField={sortField}
                sortOrder={sortOrder}
              />
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}