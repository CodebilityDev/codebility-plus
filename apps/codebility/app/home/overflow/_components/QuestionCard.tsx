"use client";

import { useState } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Clock } from "lucide-react";

import CommentSection from "./CommentSection";

interface Question {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    image_url: string | null;
  };
  tags: string[];
  images: string[];
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
}

interface QuestionCardProps {
  question: Question;
  onLike: (questionId: string) => void;
}

export default function QuestionCard({ question, onLike }: QuestionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(question.id);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl dark:bg-gray-800/70 dark:hover:bg-gray-800/80">
      {/* Question Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-0.5 dark:from-blue-900 dark:to-purple-900">
            <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-gray-800">
              {question.author.image_url ? (
                <Image
                  src={question.author.image_url}
                  alt={question.author.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar size={40} />
              )}
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {question.author.name}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3" />
              {timeAgo(question.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Question Title */}
      <h3 className="mb-3 text-xl font-medium leading-tight text-gray-900 dark:text-white">
        {question.title}
      </h3>

      {/* Question Content */}
      <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
        {question.content}
      </p>

      {/* Images */}
      {question.images && question.images.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.images.map((image, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl">
              <Image
                src={image}
                alt={`Screenshot ${index + 1}`}
                width={300}
                height={200}
                className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {question.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 text-sm font-medium text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200 ${
              isLiked 
                ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400" 
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{question.likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{question.comments}</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          {showComments ? "Hide Comments" : "View Comments"}
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-700">
          <CommentSection questionId={question.id} />
        </div>
      )}
    </div>
  );
}