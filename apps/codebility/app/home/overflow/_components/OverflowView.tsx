"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PostQuestionModal from "./PostQuestionModal";
import QuestionCard from "./QuestionCard";

// Mock data for now - this would come from your database
const mockQuestions = [
  {
    id: "1",
    title: "How to handle async state in React with TypeScript?",
    content: "I'm having trouble managing async state in my React components when using TypeScript. The types seem to get confused when dealing with loading states and error handling. Any best practices?",
    author: {
      id: "user1",
      name: "John Doe",
      image_url: null,
    },
    tags: ["React", "TypeScript", "Async"],
    images: [],
    likes: 5,
    comments: 3,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Tailwind CSS not working with Next.js 14",
    content: "After upgrading to Next.js 14, my Tailwind CSS classes aren't being applied properly. I've checked my configuration files but can't figure out what's wrong.",
    author: {
      id: "user2",
      name: "Jane Smith",
      image_url: null,
    },
    tags: ["Next.js", "Tailwind CSS", "Configuration"],
    images: [],
    likes: 8,
    comments: 7,
    created_at: "2024-01-14T15:45:00Z",
    updated_at: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    title: "Database connection timeout in Node.js",
    content: "My Node.js application keeps timing out when connecting to PostgreSQL. It works fine locally but fails in production. Connection pool settings seem correct.",
    author: {
      id: "user3",
      name: "Mike Johnson",
      image_url: null,
    },
    tags: ["Node.js", "PostgreSQL", "Database"],
    images: [],
    likes: 12,
    comments: 9,
    created_at: "2024-01-13T09:20:00Z",
    updated_at: "2024-01-13T09:20:00Z",
  },
];

export default function OverflowView() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [questions, setQuestions] = useState(mockQuestions);
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return b.likes - a.likes;
    }
  });

  const handlePostQuestion = (questionData: {
    title: string;
    content: string;
    tags: string[];
    images: string[];
  }) => {
    const newQuestion = {
      id: Date.now().toString(),
      ...questionData,
      author: {
        id: "current_user",
        name: "Current User", // This would come from your auth system
        image_url: null,
      },
      likes: 0,
      comments: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setQuestions([newQuestion, ...questions]);
    setIsPostModalOpen(false);
  };

  const handleLike = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, likes: q.likes + 1 }
        : q
    ));
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
                ? "bg-blue-500 text-white shadow-md hover:bg-blue-600" 
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
                ? "bg-blue-500 text-white shadow-md hover:bg-blue-600" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Popular
          </Button>
        </div>
        
        <Button 
          onClick={() => setIsPostModalOpen(true)}
          className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ask Question
        </Button>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onLike={handleLike}
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
              className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-indigo-600 hover:shadow-xl" 
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