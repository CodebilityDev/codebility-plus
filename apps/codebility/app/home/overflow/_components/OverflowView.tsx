"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Flame,
  Loader2,
  MessageSquare,
  Plus,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import {
  fetchQuestions,
  fetchTrendingTopics,
  getSocialPoints,
  postQuestion,
  Question,
  TrendingTopic,
} from "../actions";
import PostQuestionModal from "./PostQuestionModal";
import QuestionCard from "./QuestionCard";
import SearchFilter, { FilterOptions } from "./QuestionFilter";

// ── Types ─────────────────────────────────────────────────────────────────────

type Author = {
  id: string;
  name: string;
  image_url: string | null;
};

interface OverflowViewProps {
  author: Author;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
];

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Skeleton Loaders ──────────────────────────────────────────────────────────

function QuestionSkeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-700/50 dark:bg-gray-800/60">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-2.5 w-20 rounded-full bg-gray-100 dark:bg-gray-700/60" />
        </div>
      </div>
      <div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-700/60" />
        <div className="h-3 w-5/6 rounded-full bg-gray-100 dark:bg-gray-700/60" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-700/60" />
        <div className="h-5 w-16 rounded-full bg-gray-100 dark:bg-gray-700/60" />
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-3">
          <div className="h-7 w-7 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-2/3 rounded-full bg-gray-100 dark:bg-gray-700/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage <= 3) {
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) pages.push(i);
        pages.push("...");
      } else if (currentPage >= totalPages - 2) {
        pages.push("...");
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5">
      {/* First page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="First page"
        className="hidden h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 sm:flex"
      >
        <ChevronsLeft className="h-3.5 w-3.5" />
      </button>

      {/* Prev page */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 text-center text-sm text-gray-400 dark:text-gray-500"
              >
                ···
              </span>
            );
          }
          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              disabled={isLoading}
              aria-current={isActive ? "page" : undefined}
              className={`h-8 min-w-8 rounded-lg px-2.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-customBlue-600 shadow-customBlue-200 dark:shadow-customBlue-900/30 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next page */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>

      {/* Last page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Last page"
        className="hidden h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:bg-gray-700 sm:flex"
      >
        <ChevronsRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── PaginationBar ─────────────────────────────────────────────────────────────

function PaginationBar({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  isLoading,
  showTotal = true,
}: {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  showTotal?: boolean;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/60 sm:flex-row">
      {showTotal && totalCount !== undefined && (
        <p className="order-2 text-xs text-gray-500 dark:text-gray-400 sm:order-1">
          Page{" "}
          <span className="text-customBlue-600 dark:text-customBlue-400 font-semibold">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {totalPages}
          </span>{" "}
          ·{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {totalCount.toLocaleString()}
          </span>{" "}
          questions
        </p>
      )}
      {!showTotal && (
        <p className="order-2 text-xs text-gray-500 dark:text-gray-400 sm:order-1">
          Page{" "}
          <span className="text-customBlue-600 dark:text-customBlue-400 font-semibold">
            {currentPage}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {totalPages}
          </span>
        </p>
      )}
      <div className="order-1 sm:order-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// ── TopTrendingTopics ─────────────────────────────────────────────────────────

function TopTrendingTopics({
  topics,
  onTagClick,
}: {
  topics: TrendingTopic[];
  onTagClick: (tag: string) => void;
}) {
  const maxPosts = Math.max(...topics.map((t) => t.posts), 1);

  if (topics.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-700/50 dark:bg-gray-800/80">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
        <Flame className="h-3.5 w-3.5 shrink-0 text-amber-500" />
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
          Trending Topics
        </span>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          7d
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50 dark:divide-gray-700/40">
        {topics.map((t) => {
          const isTop3 = t.rank <= 3;
          const barWidth = Math.round((t.posts / maxPosts) * 100);

          return (
            <div
              key={t.tag}
              className="group flex items-center gap-2.5 px-4 py-2 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
            >
              {/* Rank badge */}
              <span
                className={`w-4 shrink-0 text-center text-xs font-semibold tabular-nums ${
                  isTop3
                    ? "text-violet-500 dark:text-violet-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                {t.rank}
              </span>

              {/* Tag pill */}
              <button
                onClick={() => onTagClick(t.tag)}
                className="shrink-0 whitespace-nowrap rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50"
              >
                #{t.tag}
              </button>

              {/* Activity bar */}
              <div className="min-w-0 flex-1">
                <div className="h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-violet-300 transition-all duration-500 dark:bg-violet-600"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>

              {/* Posts count */}
              <span className="shrink-0 text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
                {t.posts.toLocaleString()}
              </span>

              {/* Badge */}
              {t.badge === "Hot" && (
                <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Hot
                </span>
              )}
              {t.badge === "Rising" && (
                <span className="shrink-0 rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                  ↑ Rising
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── RecentSidebar ─────────────────────────────────────────────────────────────

function RecentSidebar({
  questions,
  trendingTopics,
  onTagClick,
  isLoading,
}: {
  questions: Question[];
  trendingTopics: TrendingTopic[];
  onTagClick: (tag: string) => void;
  isLoading: boolean;
}) {
  const recent = [...questions]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 8);

  return (
    <aside className="hidden w-72 shrink-0 lg:block">
      <div className="sticky top-6 flex flex-col gap-3">
        {/* Trending Topics */}
        <TopTrendingTopics topics={trendingTopics} onTagClick={onTagClick} />

        {/* Recent Posts */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-700/50 dark:bg-gray-800/80">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-700/50">
            <Clock className="text-customBlue-500 h-3.5 w-3.5 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-100">
              Recent Posts
            </span>
          </div>

          {/* List */}
          {isLoading ? (
            <SidebarSkeleton />
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-gray-700/40">
              {recent.length === 0 ? (
                <li className="px-4 py-8 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-200 dark:text-gray-600" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    No questions yet
                  </p>
                </li>
              ) : (
                recent.map((q) => (
                  <li
                    key={q.id}
                    className="group flex cursor-pointer items-start gap-2.5 px-4 py-2.5 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                    onClick={() => {
                      const el = document.getElementById(`question-${q.id}`);
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${avatarColor(q.author.id)}`}
                    >
                      {q.author.image_url ? (
                        <img
                          src={q.author.image_url}
                          alt={q.author.name}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(q.author.name)
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="group-hover:text-customBlue-600 dark:group-hover:text-customBlue-400 truncate text-xs font-medium leading-snug text-gray-800 transition-colors dark:text-gray-100">
                        {q.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
                        {q.author.name} · {timeAgo(q.created_at)}
                      </p>
                      {q.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {q.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            >
                              {tag}
                            </span>
                          ))}
                          {q.tags.length > 2 && (
                            <span className="self-center text-[10px] text-gray-400 dark:text-gray-500">
                              +{q.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}

          {/* Footer */}
          {!isLoading && recent.length > 0 && (
            <div className="border-t border-gray-50 px-4 py-2 text-center dark:border-gray-700/40">
              <span className="text-[11px] text-gray-400 dark:text-gray-500">
                {recent.length} latest · sorted by newest
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({
  hasFilters,
  onAskQuestion,
}: {
  hasFilters: boolean;
  onAskQuestion: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 dark:border-gray-700/50 dark:bg-gray-800">
        {hasFilters ? (
          <AlertCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
        ) : (
          <MessageSquare className="h-8 w-8 text-gray-300 dark:text-gray-600" />
        )}
      </div>
      <h3 className="mb-1.5 text-base font-semibold text-gray-700 dark:text-gray-200">
        {hasFilters ? "No matching questions" : "No questions yet"}
      </h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-400 dark:text-gray-500">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Be the first to ask a question and help build our knowledge base!"}
      </p>
      {!hasFilters && (
        <Button
          onClick={onAskQuestion}
          className="from-customBlue-500 hover:from-customBlue-600 rounded-full bg-gradient-to-r to-indigo-500 px-6 text-white shadow-sm transition-all hover:to-indigo-600"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Ask the First Question
        </Button>
      )}
    </div>
  );
}

// ── SocialPointsBadge ─────────────────────────────────────────────────────────

function SocialPointsBadge({
  points,
  className,
}: {
  points: number;
  className?: string;
}) {
  return (
    <div
      className={`flex h-9 items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 dark:border-amber-800/50 dark:bg-amber-900/20 ${className ?? ""}`}
    >
      <Star className="h-3 w-3 shrink-0 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400" />
      <span className="whitespace-nowrap text-xs font-medium text-amber-600 dark:text-amber-400">
        Social Points:
      </span>
      <span className="text-xs font-bold tabular-nums text-amber-700 dark:text-amber-300">
        {points.toLocaleString()}
      </span>
    </div>
  );
}

// ── OverflowView ──────────────────────────────────────────────────────────────

export default function OverflowView({ author }: OverflowViewProps) {
  const { toast } = useToast();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "popular" | "myPosts"
  >("newest");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socPoints, setSocPoints] = useState(0);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [solverRefreshKey, setSolverRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchBy: "all",
    hasPosted: false,
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  // ── Data Fetching ───────────────────────────────────────────────────────────

  const refreshSocialPoints = async () => {
    try {
      const points = await getSocialPoints(author.id);
      setSocPoints(points || 0);
    } catch (error) {
      console.error("Failed to fetch social points:", error);
    }
  };

  const loadQuestions = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const result = await fetchQuestions(page, 5);
      setQuestions(result.questions);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Failed to load questions",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingTopics = async () => {
    try {
      const topics = await fetchTrendingTopics();
      setTrendingTopics(topics);
    } catch (error) {
      console.error("Failed to fetch trending topics:", error);
    }
  };

  useEffect(() => {
    loadQuestions(1);
  }, []);
  useEffect(() => {
    refreshSocialPoints();
  }, [author.id]);
  useEffect(() => {
    loadTrendingTopics();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    startTransition(async () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await loadQuestions(newPage);
    });
  };

  const handlePostQuestion = async (questionData: {
    title: string;
    content: string;
    tags: string[];
    images: string[];
  }) => {
    setIsPosting(true);
    try {
      const result = await postQuestion({
        title: questionData.title,
        content: questionData.content,
        tags: questionData.tags,
        images: questionData.images,
        authorId: author.id,
      });

      if (result.success && result.question) {
        await Promise.all([
          loadQuestions(currentPage),
          refreshSocialPoints(),
          loadTrendingTopics(),
        ]);
        setIsPostModalOpen(false);
        toast({
          title: "Question posted!",
          description: "Your question is now live for the community.",
          variant: "default",
          className: "bg-green-500 text-white border-green-600",
        });
      } else {
        toast({
          title: "Couldn't post question",
          description: result.error || "Please try again.",
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      console.error("Error posting question:", error);
      toast({
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white border-red-600",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = (_questionId: string) => {
    refreshSocialPoints();
  };

  // ── Filtering & Sorting ─────────────────────────────────────────────────────

  const getFilteredQuestions = () => {
    let filtered = [...questions];

    if (sortBy === "myPosts") {
      filtered = filtered.filter((q) => q.author.id === author.id);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((q) => {
        switch (filterOptions.searchBy) {
          case "title":
            return q.title.toLowerCase().includes(query);
          case "content":
            return q.content.toLowerCase().includes(query);
          case "tags":
            return q.tags.some((tag) => tag.toLowerCase().includes(query));
          case "author":
            return q.author.name.toLowerCase().includes(query);
          default:
            return (
              q.title.toLowerCase().includes(query) ||
              q.content.toLowerCase().includes(query) ||
              q.tags.some((tag) => tag.toLowerCase().includes(query)) ||
              q.author.name.toLowerCase().includes(query)
            );
        }
      });
    }

    if (filterOptions.hasPosted) {
      const authorIds = new Set(questions.map((q) => q.author.id));
      filtered = filtered.filter((q) => authorIds.has(q.author.id));
    }

    if (filterOptions.dateFrom) {
      const fromDate = new Date(filterOptions.dateFrom);
      filtered = filtered.filter((q) => new Date(q.created_at) >= fromDate);
    }

    if (filterOptions.dateTo) {
      const toDate = new Date(filterOptions.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((q) => new Date(q.created_at) <= toDate);
    }

    return filtered;
  };

  const sortedQuestions = getFilteredQuestions().sort((a, b) => {
    switch (sortBy) {
      case "newest":
      case "myPosts":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "popular":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const hasActiveFilters = !!(
    searchQuery ||
    filterOptions.dateFrom ||
    filterOptions.dateTo
  );
  const showPagination = totalPages > 1 && !isLoading;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex items-start gap-6 xl:gap-8">
      {/* ── Main content ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        {/* Header bar */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="from-customBlue-500 hover:from-customBlue-600 inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-to-r to-indigo-500 px-4 pl-40 pr-40 pt-5 pb-5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:to-indigo-600 hover:shadow-md"
          >
            <Plus className="h-3.5 w-3.5" />
            Ask Question
          </button>
          <SocialPointsBadge
            points={socPoints}
            className="bg-gradient-to-r pl-10 pr-10 pt-5 pb-5 to-indigo-500 text-white"
          />
        </div>

        {/* Search & Filter */}
        <SearchFilter
          onSearchChange={setSearchQuery}
          onSortChange={setSortBy}
          onFilterChange={setFilterOptions}
          currentSort={sortBy}
          currentUserId={author.id}
          refreshKey={solverRefreshKey}
        />

        {/* Top pagination */}
        {showPagination && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            isLoading={isPending}
            showTotal
          />
        )}

        {/* Questions list */}
        <div className="space-y-3">
          {isLoading || isPending ? (
            // Skeleton loading state
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <QuestionSkeleton key={i} />
              ))}
            </>
          ) : sortedQuestions.length > 0 ? (
            sortedQuestions.map((question) => (
              <div id={`question-${question.id}`} key={question.id}>
                <QuestionCard
                  question={question}
                  onLike={handleLike}
                  loggedIn={author}
                  setQuestions={setQuestions}
                  refreshSocialPoints={refreshSocialPoints}
                  onSolutionMarked={() => setSolverRefreshKey((k) => k + 1)}
                />
              </div>
            ))
          ) : (
            <EmptyState
              hasFilters={hasActiveFilters}
              onAskQuestion={() => setIsPostModalOpen(true)}
            />
          )}
        </div>

        {/* Bottom pagination */}
        {showPagination && !isPending && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isPending}
            showTotal={false}
          />
        )}
      </div>

      {/* ── Sidebar ── */}
      <RecentSidebar
        questions={questions}
        trendingTopics={trendingTopics}
        onTagClick={(tag) => {
          setSearchQuery(tag);
          setFilterOptions((prev) => ({ ...prev, searchBy: "tags" }));
        }}
        isLoading={isLoading}
      />

      {/* Post modal */}
      <PostQuestionModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostQuestion}
      />
    </div>
  );
}
