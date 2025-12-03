"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PostQuestionModal from "./PostQuestionModal";
import QuestionCard from "./QuestionCard";
import { fetchQuestions, Question, postQuestion, getSocialPoints } from '../actions';

type Author = {
  id: string;
  name: string;
  image_url: string | null;
};

interface OverflowViewProps {
  author: Author;
}

export default function OverflowView({ author }: OverflowViewProps) {
  const { toast } = useToast();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "myPosts">("newest");
  const [forms, setForms] = useState<Question[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socPoints, setSocPoints] = useState(0);

  // Function to refresh social points
  const refreshSocialPoints = async () => {
    try {
      const points = await getSocialPoints(author.id);
      setSocPoints(points || 0);
    } catch (error) {
      console.error('Failed to fetch social points:', error);
    }
  }; 

  // Fetch questions on mount
  useEffect(() => {
    setIsLoading(true);
    fetchQuestions()
      .then((result) => {
        setQuestions(result);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Fetch social points on mount
  useEffect(() => {
    refreshSocialPoints();
  }, [author.id, questions]);

  const sortedQuestions = [...questions]
    .filter((q) => {
      // Filter by logged-in user's posts if "myPosts" is selected
      if (sortBy === "myPosts") {
        return q.author.id === author.id;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest" || sortBy === "myPosts") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return b.likes - a.likes;
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
      // Call the server action to post the question
      const result = await postQuestion({
        title: questionData.title,
        content: questionData.content,
        tags: questionData.tags,
        images: questionData.images,
        authorId: author.id,
      });

      if (result.success && result.question) {
        // Refresh questions
        const updatedQuestions = await fetchQuestions();
        setQuestions(updatedQuestions);
        
        // Refresh social points after posting
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
    alert(`Question ID: ${questionId}`);
    // Refresh social points after liking
    refreshSocialPoints();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header with filters and post button */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-sm dark:bg-gray-800/80">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortBy("newest")}
            className={`rounded-full px-4 py-2 transition-all duration-200 ${
              sortBy === "newest"
                ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Newest
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortBy("popular")}
            className={`rounded-full px-4 py-2 transition-all duration-200 ${
              sortBy === "popular"
                ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Popular
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortBy("myPosts")}
            className={`rounded-full px-4 py-2 transition-all duration-200 ${
              sortBy === "myPosts"
                ? "bg-customBlue-500 text-white shadow-md hover:bg-customBlue-600"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            My Posts
          </Button>
        </div>

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

      {/* Questions list */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="mx-auto max-w-md rounded-2xl bg-accent p-12 text-center backdrop-blur-sm dark:bg-gray-800/60">
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-customBlue-500 dark:border-gray-700 dark:border-t-customBlue-400"></div>
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
            <h3 className="mb-4 text-2xl font-light text-gray-900 dark:text-white">No questions yet</h3>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Be the first to ask a question and help build our knowledge base!
            </p>
            <Button
              className="rounded-full bg-gradient-to-r from-customBlue-500 to-indigo-500 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-customBlue-600 hover:to-indigo-600 hover:shadow-xl"
              onClick={() => setIsPostModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ask the First Question
            </Button>
          </div>
        )}
      </div>

      {/* Post Question Modal */}
      <PostQuestionModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handlePostQuestion}
      />
    </div>
  );
}