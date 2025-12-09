"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PostQuestionModal from "./PostQuestionModal";
import QuestionCard from "./QuestionCard";
import SearchFilter, { FilterOptions } from "./QuestionFilter";
import { fetchQuestions, Question, postQuestion, getSocialPoints } from '../actions';

type Author = {
  id: string;
  name: string;
  image_url: string | null;
};

interface OverflowViewProps {
  author: Author;
}

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push('...');
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
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
          if (page === '...') {
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

export default function OverflowView({ author }: OverflowViewProps) {
  const { toast } = useToast();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular" | "myPosts">("newest");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socPoints, setSocPoints] = useState(0);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchBy: "all",
    hasPosted: false,
    dateFrom: undefined,
    dateTo: undefined,
  });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const refreshSocialPoints = async () => {
    try {
      const points = await getSocialPoints(author.id);
      setSocPoints(points || 0);
    } catch (error) {
      console.error('Failed to fetch social points:', error);
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
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch questions on mount
  useEffect(() => {
    loadQuestions(1);
  }, []);

  // Fetch social points on mount
  useEffect(() => {
    refreshSocialPoints();
  }, [author.id]);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    startTransition(async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await loadQuestions(newPage);
    });
  };

  // Apply search and filters
  const getFilteredQuestions = () => {
    let filtered = [...questions];

    // Apply "My Posts" filter first
    if (sortBy === "myPosts") {
      filtered = filtered.filter((q) => q.author.id === author.id);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((q) => {
        switch (filterOptions.searchBy) {
          case "title":
            return q.title.toLowerCase().includes(query);
          case "content":
            return q.content.toLowerCase().includes(query);
          case "tags":
            return q.tags.some(tag => tag.toLowerCase().includes(query));
          case "author":
            return q.author.name.toLowerCase().includes(query);
          case "all":
          default:
            return (
              q.title.toLowerCase().includes(query) ||
              q.content.toLowerCase().includes(query) ||
              q.tags.some(tag => tag.toLowerCase().includes(query)) ||
              q.author.name.toLowerCase().includes(query)
            );
        }
      });
    }

    // Apply "has posted" filter (authors who have created posts)
    if (filterOptions.hasPosted) {
      // This would require additional data about which authors have posts
      // For now, we'll just filter to show questions from authors who appear in the list
      const authorIds = new Set(questions.map(q => q.author.id));
      filtered = filtered.filter(q => authorIds.has(q.author.id));
    }

    // Apply date filters
    if (filterOptions.dateFrom) {
      const fromDate = new Date(filterOptions.dateFrom);
      filtered = filtered.filter(q => new Date(q.created_at) >= fromDate);
    }
    if (filterOptions.dateTo) {
      const toDate = new Date(filterOptions.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(q => new Date(q.created_at) <= toDate);
    }

    return filtered;
  };

  // Apply sorting
  const sortedQuestions = getFilteredQuestions().sort((a, b) => {
    switch (sortBy) {
      case "newest":
      case "myPosts":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "popular":
        return b.likes - a.likes;
      default:
        return 0;
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
        // Reload current page to show new question
        await loadQuestions(currentPage);
        await refreshSocialPoints();
        
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
      console.error('Error posting question:', error);
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

  const handleLike = (questionId: string) => {
    refreshSocialPoints();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header with Ask Question button and Social Points */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={() => setIsPostModalOpen(true)}
          className="rounded-full bg-gradient-to-r from-customBlue-500 to-indigo-500 px-6 py-2 text-white shadow-lg transition-all duration-200 hover:from-customBlue-600 hover:to-indigo-600 hover:shadow-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ask Question
        </Button>
        
        {/* Social Points Display */}
        <div className="flex w-48 gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 shadow-lg">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">Social Points</span>
            <span className="text-lg font-bold text-foreground">{socPoints}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Component */}
      <SearchFilter
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onFilterChange={setFilterOptions}
        currentSort={sortBy}
        currentUserId={author.id}
      />

      {/* Top Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-white/70 p-3 sm:p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/70">
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
            Showing page <span className="font-semibold text-customBlue-600 dark:text-customBlue-400">{currentPage}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
            {' '}({totalCount} total questions)
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
            <h3 className="mb-4 text-2xl font-light text-gray-900 dark:text-white">Loading questions...</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we fetch the latest questions.
            </p>
          </div>
        ) : sortedQuestions.length > 0 ? (
          sortedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onLike={handleLike}
              loggedIn={author}
              setQuestions={setQuestions}
              refreshSocialPoints={refreshSocialPoints}
            />
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
            Page <span className="font-semibold text-customBlue-600 dark:text-customBlue-400">{currentPage}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
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

      {/* Post Question Modal */}
      <PostQuestionModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostQuestion}
      />
    </div>
  );
}