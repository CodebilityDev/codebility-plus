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
import PostQuestionModal from "./PostQuestionModal"; // Import the modal
import { updateQuestion, deletePostAndImages} from "../actions";
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

function TimeAgo({ dateString }: { dateString: string }) {
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

  return <>{timeAgoText}</>;
}

export default function QuestionCard({ question, onLike, loggedIn, setQuestions}: QuestionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner = question.author.id === loggedIn.id;
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(question.id);
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
      // TODO: Replace with your actual API call
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
      };

      // Update the question in the parent component
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

      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Failed to delete question. Please try again.');
    }
    setShowMenu(false);
  }
};

  return (
      <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl dark:bg-gray-800/70 dark:hover:bg-gray-800/80">
        {/* Question Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-customBlue-100 to-purple-100 p-0.5 dark:from-customBlue-900 dark:to-purple-900">
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
                <TimeAgo dateString={question.created_at} />
              </div>
            </div>
          </div>

          {/* Three-dot menu for owner */}
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-full p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>

              {showMenu && (
                <div className="absolute right-0 top-10 z-10 w-48 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <button
                    onClick={handleEdit}
                    className="flex w-full items-center gap-3 rounded-t-xl px-4 py-3 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex w-full items-center gap-3 rounded-b-xl px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
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
          <div className="mb-4 px-12">
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
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-shadow duration-300 hover:shadow-md cursor-pointer"
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
                  <div className="sm:hidden flex text-xs text-muted-foreground">
                    Swipe to check for more images.
                  </div>
                  <CarouselPrevious className="hidden sm:flex text-foreground border-foreground" />
                  <CarouselNext className="hidden sm:flex text-foreground border-foreground" />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Tags */}
        {question.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-gradient-to-r from-customBlue-50 to-indigo-50 px-3 py-1 text-sm font-medium text-customBlue-700 dark:from-customBlue-900/30 dark:to-indigo-900/30 dark:text-customBlue-300"
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
              className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-200 ${isLiked
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