"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@codevs/ui/carousel"
import CommentSection from "./CommentSection";
import QuestionImagePreview from "./QuestionImagePreview"
import PostQuestionModal from "./PostQuestionModal";
import { updateQuestion, deletePostAndImages, togglePostLike, checkPostLike } from "../actions";
import { useToast } from "@/components/ui/use-toast";

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
  loggedIn : {
    id: string;
    name: string;
    image_url: string | null;
  }
  setQuestions : React.Dispatch<React.SetStateAction<Question[]>>;
}

function TimeAgo({ dateString, isEdited }: { dateString: string; isEdited?: boolean }) {
  const [timeAgoText, setTimeAgoText] = useState<string>("");

  useEffect(() => {
    const calculateTimeAgo = () => {
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

    setTimeAgoText(calculateTimeAgo());
  }, [dateString]);

  return (
    <>
      {timeAgoText}
      {isEdited && <span className="text-gray-400 dark:text-gray-500"> (edited)</span>}
    </>
  );
}

export default function QuestionCard({ question, onLike, loggedIn, setQuestions}: QuestionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = question.author.id === loggedIn.id;
  const { toast } = useToast();
  
  // Check if the post has been edited
  const isEdited = question.created_at !== question.updated_at;
  const displayDate = isEdited ? question.updated_at : question.created_at;

  // Check if user has already liked this post on mount
  useEffect(() => {
    const checkLikeStatus = async () => {
      const result = await checkPostLike(question.id, loggedIn.id);
      if (result.success) {
        setIsLiked(result.liked);
      }
    };
    checkLikeStatus();
  }, [question.id, loggedIn.id]);

  const handleLike = async () => {
    if (isLiking) return; // Prevent double clicks
    
    setIsLiking(true);
    
    // Optimistic UI update
    const previousLikeState = isLiked;
    const previousLikeCount = question.likes;
    
    setIsLiked(!isLiked);
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === question.id
          ? { ...q, likes: isLiked ? q.likes - 1 : q.likes + 1 }
          : q
      )
    );

    try {
      const result = await togglePostLike(question.id, loggedIn.id);

      if (!result.success) {
        // Revert on failure
        setIsLiked(previousLikeState);
        setQuestions(prevQuestions =>
          prevQuestions.map(q =>
            q.id === question.id
              ? { ...q, likes: previousLikeCount }
              : q
          )
        );
        
        toast({
          title: "Error",
          description: "Failed to update like. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousLikeState);
      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === question.id
            ? { ...q, likes: previousLikeCount }
            : q
        )
      );
      
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const [selectedImage, setSelectedImage] = useState<{
    src: string
    alt: string
  } | null>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    images: string[];
    authorId: string;
  }) => {
    try {
      const result = await updateQuestion({
            question_id: data.id,
            title: data.title,
            content: data.content,
            tags: data.tags,
            images: data.images,
            authorId: data.authorId
          });

      if (result.success && result.question) {
        const updatedQuestion = result;
      }

      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === question.id
            ? { ...q, ...data, updated_at: new Date().toISOString() }
            : q
        )
      );

      setShowEditModal(false);
      toast({
          title: "Success!",
          description: "Your question updated successfully.",
          variant: "default",
          className: "bg-green-500 text-white border-green-600",
        });
    } catch (error) {
      toast({
          title: "Failed to post question",
          description: "An error occured, please try again.",
          variant: "destructive",
          className: "bg-red-500 text-white border-red-600",
        });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        const result = await deletePostAndImages(parseInt(question.id));

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete question');
        }

        setQuestions(prevQuestions =>
          prevQuestions.filter(q => q.id !== question.id)
        );

        toast({
          title: "Success!",
          description: "Question deleted successfully!",
          variant: "default",
          className: "bg-green-500 text-white border-green-600",
        });
      } catch (error) {
        console.error('Error deleting question:', error);
        toast({
          title: "Error",
          description: "Failed to delete question. Please try again.",
          variant: "destructive",
        });
      }
      setShowMenu(false);
    }
  };

  return (
      <div className="rounded-xl sm:rounded-2xl bg-white/70 p-4 sm:p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl dark:bg-gray-800/70 dark:hover:bg-gray-800/80">
        {/* Question Header */}
        <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
            {/* Avatar - Responsive sizing */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-customBlue-100 to-purple-100 p-0.5 dark:from-customBlue-900 dark:to-purple-900">
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
            
            {/* Author info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                {question.author.name}
              </p>
              <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <TimeAgo dateString={displayDate} isEdited={isEdited} />
              </div>
            </div>
          </div>

          {/* Three-dot menu for owner */}
          {isOwner && (
            <div className="relative flex-shrink-0" ref={menuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-full p-1.5 sm:p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 top-9 sm:top-10 z-10 w-40 sm:w-48 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={handleEdit}
                    className="flex w-full items-center gap-2 sm:gap-3 rounded-t-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 sm:gap-3 rounded-b-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Question Title - Responsive text */}
        <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-medium leading-tight text-gray-900 dark:text-white break-words">
          {question.title}
        </h3>

        {/* Question Content - Responsive text */}
        <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 break-words">
          {question.content}
        </p>

        {/* Images - Responsive carousel */}
        {question.images && question.images.length > 0 && (
          <div className="mb-3 sm:mb-4 px-0 sm:px-8 md:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: question.images.length > 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {question.images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className={`pl-2 md:pl-4 ${question.images.length === 1
                      ? 'basis-full'
                      : question.images.length === 2
                        ? 'basis-full sm:basis-1/2'
                        : 'basis-full sm:basis-1/2 lg:basis-1/3'
                      }`}
                  >
                    <div
                      className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-shadow duration-300 hover:shadow-md cursor-pointer"
                      onClick={() => setSelectedImage({
                        src: image,
                        alt: `Screenshot ${index + 1}`
                      })}
                    >
                      <div
                        className="relative w-full"
                        style={{
                          paddingBottom: question.images.length === 1 ? '56.25%' : '75%'
                        }}
                      >
                        <Image
                          src={image}
                          alt={`Screenshot ${index + 1}`}
                          fill
                          sizes={
                            question.images.length === 1
                              ? '100vw'
                              : question.images.length === 2
                                ? '(max-width: 640px) 100vw, 50vw'
                                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                          }
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {question.images.length > 1 && (
                <>
                  <div className="sm:hidden flex text-xs text-muted-foreground mt-2">
                    Swipe to check for more images.
                  </div>
                  <CarouselPrevious className="hidden sm:flex text-foreground border-foreground" />
                  <CarouselNext className="hidden sm:flex text-foreground border-foreground" />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Tags - Responsive sizing */}
        {question.tags.length > 0 && (
          <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gradient-to-r from-customBlue-50 to-indigo-50 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-customBlue-700 dark:from-customBlue-900/30 dark:to-indigo-900/30 dark:text-customBlue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions - Responsive layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 pt-3 sm:pt-4 dark:border-gray-700">
          {/* Like and Comment buttons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${isLiked
                ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs sm:text-sm font-medium">{question.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium">{question.comments}</span>
            </Button>
          </div>

          {/* View/Hide Comments button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="w-full sm:w-auto rounded-full bg-gray-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {showComments ? "Hide Comments" : "View Comments"}
          </Button>
        </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-6 dark:border-gray-700">
          <CommentSection 
            questionId={question.id} 
            loggedIn={loggedIn} 
            setQuestions={setQuestions}
          />
        </div>
      )}

      {selectedImage && (
        <QuestionImagePreview
          isOpen={true}
          onClose={() => setSelectedImage(null)}
          imageSrc={selectedImage.src}
          imageAlt={selectedImage.alt}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <PostQuestionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          editQuestion={{
            id: question.id,
            title: question.title,
            content: question.content,
            tags: question.tags,
            images: question.images,
            authorId: question.author.id
          }}
          mode='edit'
        />
      )}
    </div>
  );
}