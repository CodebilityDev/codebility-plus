"use client";

import { useState } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@codevs/ui/textarea";
import { Heart, Send, Clock, Upload, X } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image_url: string | null;
  };
  images: string[];
  likes: number;
  created_at: string;
}

interface CommentSectionProps {
  questionId: string;
}

// Mock comments data - this would come from your database
const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      content: "You can use a custom hook with useState and useEffect to manage async state. Try creating a useAsync hook that handles loading, data, and error states.",
      author: {
        id: "user4",
        name: "Sarah Wilson",
        image_url: null,
      },
      images: [],
      likes: 3,
      created_at: "2024-01-15T11:30:00Z",
    },
    {
      id: "c2",
      content: "I recommend using React Query or SWR for handling async state. They provide excellent TypeScript support and handle caching, error states, and loading states automatically.",
      author: {
        id: "user5",
        name: "Alex Brown",
        image_url: null,
      },
      images: [],
      likes: 7,
      created_at: "2024-01-15T12:15:00Z",
    },
  ],
  "2": [
    {
      id: "c3",
      content: "Make sure your tailwind.config.js file includes the correct paths for your app directory. With Next.js 14, you might need to update the content paths.",
      author: {
        id: "user6",
        name: "David Lee",
        image_url: null,
      },
      images: [],
      likes: 5,
      created_at: "2024-01-14T16:30:00Z",
    },
  ],
  "3": [
    {
      id: "c4",
      content: "Check your connection pool configuration. You might need to increase the pool size or timeout values for production.",
      author: {
        id: "user7",
        name: "Emma Davis",
        image_url: null,
      },
      images: [],
      likes: 4,
      created_at: "2024-01-13T10:45:00Z",
    },
  ],
};

export default function CommentSection({ questionId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments[questionId] || []);
  const [newComment, setNewComment] = useState("");
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        author: {
          id: "current_user",
          name: "Current User", // This would come from your auth system
          image_url: null,
        },
        images: commentImages,
        likes: 0,
        created_at: new Date().toISOString(),
      };
      
      setComments([...comments, comment]);
      setNewComment("");
      setCommentImages([]);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const newLikedComments = new Set(likedComments);
    
    if (likedComments.has(commentId)) {
      newLikedComments.delete(commentId);
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, likes: c.likes - 1 } : c
      ));
    } else {
      newLikedComments.add(commentId);
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, likes: c.likes + 1 } : c
      ));
    }
    
    setLikedComments(newLikedComments);
  };

  const handleCommentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCommentImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeCommentImage = (index: number) => {
    setCommentImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
              {/* Comment Header */}
              <div className="mb-2 flex items-start justify-between ">
                <div className="flex items-center gap-2 ">
                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    {comment.author.image_url ? (
                      <Image
                        src={comment.author.image_url}
                        alt={comment.author.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar size={32} />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-white">
                      <Clock className="h-3 w-3" />
                      {timeAgo(comment.created_at)}
                    </div>
                  </div>
                </div>
                <div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1 px-2 py-1 ${
                    likedComments.has(comment.id)
                      ? "text-red-600 hover:text-red-700"
                      : "text-gray-600 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                  <span className="text-sm">{comment.likes}</span>
                </Button>
                </div>
              </div>
              
              {/* Comment Content */}
              <p className="text-sm text-gray-700 dark:text-white leading-relaxed">
                {comment.content}
              </p>
              
              {/* Comment Images */}
              {comment.images && comment.images.length > 0 && (
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {comment.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Comment screenshot ${index + 1}`}
                        width={200}
                        height={150}
                        className="rounded-md border border-gray-200 object-cover dark:border-gray-700"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <Textarea
          placeholder="Write a helpful comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
          rows={3}
          className="resize-none border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
        />
        
        {/* Comment Image Upload */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleCommentImageUpload}
            disabled={isSubmitting}
            className="hidden"
            id="comment-image-upload"
          />
          <label
            htmlFor="comment-image-upload"
            className="flex cursor-pointer items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Upload className="h-3 w-3" />
            Add Images
          </label>
        </div>
        
        {/* Comment Image Preview */}
        {commentImages.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {commentImages.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={image}
                  alt={`Comment image ${index + 1}`}
                  width={150}
                  height={100}
                  className="rounded-md border object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCommentImage(index)}
                  className="absolute right-1 top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-white hover:bg-red-600"
                >
                  <X className="h-2 w-2" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
          >
            <Send className="mr-2 h-5 w-5" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {comments.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-white">
            No comments yet. Be the first to help!
          </p>
        </div>
      )}
    </div>
  );
}