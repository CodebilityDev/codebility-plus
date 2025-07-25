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
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Question Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            {question.author.image_url ? (
              <Image
                src={question.author.image_url}
                alt={question.author.name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <DefaultAvatar size={32} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {question.author.name}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-white">
              <Clock className="h-3 w-3" />
              {timeAgo(question.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* Question Title */}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {question.title}
      </h3>

      {/* Question Content */}
      <p className="mb-3 leading-relaxed text-gray-700 dark:text-white">
        {question.content}
      </p>

      {/* Images */}
      {question.images && question.images.length > 0 && (
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={image}
                alt={`Screenshot ${index + 1}`}
                width={300}
                height={200}
                className="rounded-md border border-gray-200 object-cover dark:border-gray-700"
              />
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {question.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-blue-100 px-2 py-1 text-xs text-white dark:bg-blue-900 dark:text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 ${
              isLiked 
                ? "text-red-600 hover:text-red-700" 
                : "text-gray-600 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm">{question.likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm">{question.comments}</span>
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide Comments" : "View Comments"}
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <CommentSection questionId={question.id} />
        </div>
      )}
    </div>
  );
}