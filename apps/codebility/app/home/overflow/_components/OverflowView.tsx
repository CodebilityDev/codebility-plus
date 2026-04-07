"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Clock, Flame } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PostQuestionModal from "./PostQuestionModal";
import QuestionCard from "./QuestionCard";
import SearchFilter, { FilterOptions } from "./QuestionFilter";
import { fetchQuestions, Question, postQuestion, getSocialPoints, fetchTrendingTopics, TrendingTopic } from '../actions';

type Author = {
  id: string;
  name: string;
  image_url: string | null;
};

interface OverflowViewProps {
  author: Author;
}

// ── helpers ───────────────────────────────────────────────────────────────────

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
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

function avatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
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
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || isLoading}
        className="hidden sm:flex h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }
          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;
          return (
            <Button
              key={pageNumber}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              disabled={isLoading}
              className={`h-8 min-w-8 px-2 sm:px-3 text-xs sm:text-sm ${
                isActive
                  ? "bg-customBlue-600 text-white hover:bg-customBlue-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || isLoading}
        className="hidden sm:flex h-8 w-8 p-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
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
    <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-5-5-11-5-11z" fill="#EF9F27" />
          <path
            d="M12 13c0 0-2.5-2-2.5-4.5 0 0-1.5 1.5-1.5 3.5a4 4 0 008 0c0-2-1.5-4-1.5-4S12 10.5 12 13z"
            fill="#BA7517"
          />
        </svg>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Top trending topics
        </span>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          Last 7 days
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {topics.map((t) => {
          const isTop3 = t.rank <= 3;
          const barWidth = Math.round((t.posts / maxPosts) * 100);

          return (
            <div
              key={t.tag}
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {/* Rank */}
              <span
                className={`w-4 text-center text-xs shrink-0 ${
                  isTop3
                    ? "font-semibold text-violet-500 dark:text-violet-400"
                    : "font-normal text-gray-400 dark:text-gray-500"
                }`}
              >
                {t.rank}
              </span>

              {/* Tag pill */}
              <button
                onClick={() => onTagClick(t.tag)}
                className="shrink-0 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-2 py-0.5 text-xs font-medium hover:bg-violet-200 dark:hover:bg-violet-900/60 transition-colors whitespace-nowrap border-none cursor-pointer"
              >
                #{t.tag}
              </button>

              {/* Activity bar */}
              <div className="flex-1 min-w-0">
                <div className="h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-400 dark:bg-violet-500 transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>

              {/* Posts stat */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-gray-400 dark:text-gray-500">posts</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {t.posts.toLocaleString()}
                </span>
              </div>

              {/* Engagement stat */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs text-gray-400 dark:text-gray-500">eng.</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {t.engagement.toLocaleString()}
                </span>
              </div>

              {/* Badge */}
              {t.badge === "Hot" && (
                <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 text-xs font-medium">
                  Hot
                </span>
              )}
              {t.badge === "Rising" && (
                <span className="shrink-0 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 px-2 py-0.5 text-xs font-medium">
                  Rising
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
}: {
  questions: Question[];
  trendingTopics: TrendingTopic[];
  onTagClick: (tag: string) => void;
}) {
  const recent = [...questions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);

  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-6 flex flex-col gap-4">

        {/* Trending Topics */}
        <TopTrendingTopics topics={trendingTopics} onTagClick={onTagClick} />

        {/* Recent Posts */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <Clock className="h-4 w-4 text-customBlue-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Most Recently Posted
            </span>
          </div>

          {/* List */}
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {recent.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No questions yet
              </li>
            )}
            {recent.map((q) => (
              <li
                key={q.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => {
                  const el = document.getElementById(`question-${q.id}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {/* Avatar */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(q.author.id)}`}
                >
                  {q.author.image_url ? (
                    <img
                      src={q.author.image_url}
                      alt={q.author.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    getInitials(q.author.name)
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-snug text-gray-900 dark:text-white">
                    {q.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {q.author.name} · {timeAgo(q.created_at)}
                  </p>
                  {q.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {q.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {q.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{q.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          {recent.length > 0 && (
            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2.5 text-center">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Showing {recent.length} latest submissions
              </span>
            </div>
          )}
        </div>

      </div>
    </aside>
  );
}

// ── OverflowView ──────────────────────────────────────────────────────────────

export default function OverflowView({ author }: OverflowViewProps) {
  const { toast } = useToast();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular" | "myPosts">("newest");
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
        title: "Error",
        description: "Failed to load questions. Please try again.",
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

  useEffect(() => { loadQuestions(1); }, []);
  useEffect(() => { refreshSocialPoints(); }, [author.id]);
  useEffect(() => { loadTrendingTopics(); }, []);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    startTransition(async () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await loadQuestions(newPage);
    });
  };

  const getFilteredQuestions = () => {
    let filtered = [...questions];
    if (sortBy === "myPosts") filtered = filtered.filter((q) => q.author.id === author.id);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((q) => {
        switch (filterOptions.searchBy) {
          case "title":   return q.title.toLowerCase().includes(query);
          case "content": return q.content.toLowerCase().includes(query);
          case "tags":    return q.tags.some((tag) => tag.toLowerCase().includes(query));
          case "author":  return q.author.name.toLowerCase().includes(query);
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
      case "myPosts": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "popular": return b.likes - a.likes;
      default:        return 0;
    }
  });

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
        await loadQuestions(currentPage);
        await refreshSocialPoints();
        await loadTrendingTopics();
        setIsPostModalOpen(false);
        toast({
          title: "Success!",
          description: "Your question has been posted successfully.",
          variant: "default",
          className: "bg-green-500 text-white border-green-600",
        });
      } else {
        toast({
          title: "Failed to post question",
          description: result.error || "Please try again.",
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      console.error("Error posting question:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
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


  return (
    <div className="flex items-start gap-8">

      {/* Main content */}
      <div className="flex flex-1 min-w-0 flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => setIsPostModalOpen(true)}
            className="rounded-full bg-gradient-to-r from-customBlue-500 to-indigo-500 px-6 py-2 text-white shadow-lg transition-all duration-200 hover:from-customBlue-600 hover:to-indigo-600 hover:shadow-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ask Question
          </Button>
          <div className="flex w-48 gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 shadow-lg">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">Social Points</span>
              <span className="text-lg font-bold text-foreground">{socPoints}</span>
            </div>
          </div>
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

        {/* Top Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-white/70 p-3 sm:p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/70">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
              Showing page{" "}
              <span className="font-semibold text-customBlue-600 dark:text-customBlue-400">{currentPage}</span>{" "}
              of <span className="font-semibold">{totalPages}</span> ({totalCount} total questions)
            </div>
            <div className="order-1 sm:order-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isPending}
              />
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-6">
          {isLoading || isPending ? (
            <div className="mx-auto max-w-md rounded-2xl bg-accent p-12 text-center backdrop-blur-sm dark:bg-gray-800/60">
              <div className="mb-6 flex justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-customBlue-500" />
              </div>
              <h3 className="mb-4 text-2xl font-light text-gray-900 dark:text-white">
                Loading questions...
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we fetch the latest questions.
              </p>
            </div>
          ) : sortedQuestions.length > 0 ? (
            sortedQuestions.map((question) => (
              <div id={`question-${question.id}`} key={question.id}>
                <QuestionCard
                  question={question}
                  onLike={handleLike}
                  loggedIn={author}
                  setQuestions={setQuestions}
                  refreshSocialPoints={refreshSocialPoints}
                  onSolutionMarked={() => setSolverRefreshKey(k => k + 1)}
                />
              </div>
            ))
          ) : (
            <div className="mx-auto max-w-md rounded-2xl bg-white/60 p-12 text-center backdrop-blur-sm dark:bg-gray-800/60">
              <div className="mb-6 text-6xl">💭</div>
              <h3 className="mb-4 text-2xl font-light text-gray-900 dark:text-white">
                {searchQuery || filterOptions.dateFrom || filterOptions.dateTo
                  ? "No questions found"
                  : "No questions yet"}
              </h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                {searchQuery || filterOptions.dateFrom || filterOptions.dateTo
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Be the first to ask a question and help build our knowledge base!"}
              </p>
              {!searchQuery && !filterOptions.dateFrom && !filterOptions.dateTo && (
                <Button
                  className="rounded-full bg-gradient-to-r from-customBlue-500 to-indigo-500 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-customBlue-600 hover:to-indigo-600 hover:shadow-xl"
                  onClick={() => setIsPostModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ask the First Question
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Pagination */}
        {totalPages > 1 && !isLoading && !isPending && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-white/70 p-3 sm:p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/70">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
              Page{" "}
              <span className="font-semibold text-customBlue-600 dark:text-customBlue-400">{currentPage}</span>{" "}
              of <span className="font-semibold">{totalPages}</span>
            </div>
            <div className="order-1 sm:order-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isPending}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <RecentSidebar
        questions={questions}
        trendingTopics={trendingTopics}
        onTagClick={(tag) => {
          setSearchQuery(tag);
          setFilterOptions((prev) => ({ ...prev, searchBy: "tags" }));
        }}
      />

      {/* Modal */}
      <PostQuestionModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostQuestion}
      />
    </div>
  );
}