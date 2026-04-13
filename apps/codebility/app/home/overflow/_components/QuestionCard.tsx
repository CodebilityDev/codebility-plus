"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Clock, MoreHorizontal, Pencil, Trash2, FileText, ArrowBigUp } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@codevs/ui/carousel"
import CommentSection from "./CommentSection";
import QuestionImagePreview from "./QuestionImagePreview"
import PostQuestionModal, { QuestionContentDisplay }  from "./PostQuestionModal";
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
  refreshSocialPoints: () => Promise<void>;
  onSolutionMarked?: () => void; // ← add
}

// Memoized TimeAgo component
const TimeAgo = memo(function TimeAgo({ 
  dateString, 
  isEdited 
}: { 
  dateString: string; 
  isEdited?: boolean;
}) {
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
});

// Memoized QuestionAuthor component
const QuestionAuthor = memo(function QuestionAuthor({
  author,
  displayDate,
  isEdited,
}: {
  author: { id: string; name: string; image_url: string | null };
  displayDate: string;
  isEdited: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
      <div className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-customBlue-100 to-purple-100 p-0.5 dark:from-customBlue-900 dark:to-purple-900">
        <div className="h-full w-full overflow-hidden rounded-full bg-white dark:bg-gray-800">
          {author.image_url ? (
            <Image
              src={author.image_url}
              alt={author.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <DefaultAvatar size={40} />
          )}
        </div>
      </div>
      
      <div className="min-w-0 flex-1">
        <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
          {author.name}
        </p>
        <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <TimeAgo dateString={displayDate} isEdited={isEdited} />
        </div>
      </div>
    </div>
  );
});

// Memoized OwnerMenu component
const OwnerMenu = memo(function OwnerMenu({
  showMenu,
  onToggleMenu,
  onEdit,
  onDelete,
}: {
  showMenu: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggleMenu();
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, onToggleMenu]);

  return (
    <div className="relative flex-shrink-0" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleMenu}
        className="rounded-full p-1.5 sm:p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
      >
        <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>

      {showMenu && (
        <div className="absolute right-0 top-9 sm:top-10 z-10 w-40 sm:w-48 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={onEdit}
            className="flex w-full items-center gap-2 sm:gap-3 rounded-t-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex w-full items-center gap-2 sm:gap-3 rounded-b-xl px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
});

// Helper function to determine if a file is an image
const isFileImage = (src: string): boolean => {
  return src.startsWith('data:image/') || /\.(jpe?g|png|gif|webp)$/i.test(src);
}

// Helper function to get file type
const getFileType = (src: string): string => {
  if (src.startsWith('data:')) {
    const mimeMatch = src.match(/data:([^;]+);/);
    const mimeType = mimeMatch?.[1] || '';
    
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('wordprocessingml')) return 'doc';
    if (mimeType.includes('text')) return 'txt';
  } else {
    const ext = src.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (ext === 'txt') return 'txt';
  }
  return 'file';
}

// Memoized FilePreviewThumbnail component for documents
const FilePreviewThumbnail = memo(function FilePreviewThumbnail({
  fileType,
  fileName,
  onClick,
}: {
  fileType: string;
  fileName: string;
  onClick: () => void;
}) {
  const getIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <span className="text-red-600 font-bold text-lg">PDF</span>;
      case 'doc':
        return <span className="text-blue-600 font-bold text-lg">DOC</span>;
      case 'txt':
        return <span className="text-gray-600 font-bold text-lg">TXT</span>;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  }

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer dark:from-gray-700 dark:to-gray-800 dark:border-gray-700"
    >
      <div className="relative w-full" style={{ paddingBottom: '75%' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white dark:bg-gray-900">
            {getIcon()}
          </div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate px-2 text-center max-w-full">
            {fileName}
          </p>
        </div>
      </div>
    </div>
  );
});

// Memoized QuestionFiles component (updated from QuestionImages)
const QuestionFiles = memo(function QuestionFiles({
  files,
  onFileClick,
}: {
  files: string[];
  onFileClick: (file: string, index: number) => void;
}) {
  if (!files || files.length === 0) return null;

  const getFileName = (src: string, index: number): string => {
    if (src.startsWith('data:')) {
      const fileType = getFileType(src);
      return `Document ${index + 1}.${fileType === 'doc' ? 'docx' : fileType}`;
    } else {
      return src.split('/').pop() || `File ${index + 1}`;
    }
  }

  return (
    <div className="mb-3 sm:mb-4 px-0 sm:px-8 md:px-12">
      <Carousel
        opts={{
          align: "start",
          loop: files.length > 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {files.map((file, index) => {
            const isImage = isFileImage(file);
            const fileType = getFileType(file);
            const fileName = getFileName(file, index);

            return (
              <CarouselItem
                key={index}
                className={`pl-2 md:pl-4 ${files.length === 1
                  ? 'basis-full'
                  : files.length === 2
                    ? 'basis-full sm:basis-1/2'
                    : 'basis-full sm:basis-1/2 lg:basis-1/3'
                  }`}
              >
                {isImage ? (
                  <div
                    className="group relative overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 shadow-sm transition-shadow duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => onFileClick(file, index)}
                  >
                    <div
                      className="relative w-full"
                      style={{
                        paddingBottom: files.length === 1 ? '56.25%' : '75%'
                      }}
                    >
                      <Image
                        src={file}
                        alt={`Screenshot ${index + 1}`}
                        fill
                        sizes={
                          files.length === 1
                            ? '100vw'
                            : files.length === 2
                              ? '(max-width: 640px) 100vw, 50vw'
                              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        }
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ) : (
                  <FilePreviewThumbnail
                    fileType={fileType}
                    fileName={fileName}
                    onClick={() => onFileClick(file, index)}
                  />
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {files.length > 1 && (
          <>
            <div className="sm:hidden flex text-xs text-muted-foreground mt-2">
              Swipe to check for more files.
            </div>
            <CarouselPrevious className="hidden sm:flex text-foreground border-foreground" />
            <CarouselNext className="hidden sm:flex text-foreground border-foreground" />
          </>
        )}
      </Carousel>
    </div>
  );
});

// Memoized QuestionTags component
const QuestionTags = memo(function QuestionTags({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5 sm:gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="rounded-full bg-gradient-to-r from-customBlue-50 to-indigo-50 px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-customBlue-700 dark:from-customBlue-900/30 dark:to-indigo-900/30 dark:text-customBlue-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
});

// Memoized QuestionActions component
const QuestionActions = memo(function QuestionActions({
  isLiked,
  likes,
  comments,
  showComments,
  isLiking,
  onLike,
  onToggleComments,
}: {
  isLiked: boolean;
  likes: number;
  comments: number;
  showComments: boolean;
  isLiking: boolean;
  onLike: () => void;
  onToggleComments: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 border-t border-gray-100 pt-3 sm:pt-4 dark:border-gray-700">
      <div className="flex items-center gap-3 sm:gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          disabled={isLiking}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 ${isLiked
            ? "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <ArrowBigUp className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span className="text-xs sm:text-sm font-medium">{likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleComments}
          className="flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs sm:text-sm font-medium">{comments}</span>
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleComments}
        className="w-full sm:w-auto rounded-full bg-gray-50 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        {showComments ? "Hide Comments" : "View Comments"}
      </Button>
    </div>
  );
});

export default function QuestionCard({ question, onLike, loggedIn, setQuestions, onSolutionMarked }: QuestionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    src: string
    alt: string
  } | null>(null);

  const isOwner = question.author.id === loggedIn.id;
  const { toast } = useToast();
  
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

  // Memoize handleLike
  const handleLike = useCallback(async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    
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
  }, [isLiking, isLiked, question.id, question.likes, loggedIn.id, setQuestions, toast]);

  // Memoize toggle functions
  const toggleComments = useCallback(() => {
    setShowComments(prev => !prev);
  }, []);

  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  // Memoize handleEdit
  const handleEdit = useCallback(() => {
    setShowMenu(false);
    setShowEditModal(true);
  }, []);

  // Memoize handleEditSubmit
  const handleEditSubmit = useCallback(async (data: {
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
  }, [question.id, setQuestions, toast]);

  // Memoize handleDelete
  const handleDelete = useCallback(async () => {
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
  }, [question.id, setQuestions, toast]);

  // Memoize handleFileClick
  const handleFileClick = useCallback((file: string, index: number) => {
    const isImage = isFileImage(file);
    setSelectedFile({
      src: file,
      alt: isImage ? `Screenshot ${index + 1}` : `File ${index + 1}`
    });
  }, []);

  // Memoize closeFilePreview
  const closeFilePreview = useCallback(() => {
    setSelectedFile(null);
  }, []);

  // Memoize closeEditModal
  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const ExpandableContent = memo(function ExpandableContent({
    content,
    threshold = 300,
    className,
  }: {
    content: string;
    threshold?: number;
    className?: string;
  }) {
    const [expanded, setExpanded] = useState(false);
    const needsTruncation = content.length > threshold;

    return (
      <span className={className}>
        <QuestionContentDisplay
          content={expanded || !needsTruncation ? content : content.slice(0, threshold) + "…"}
          className={className ?? ""}
        />
        {needsTruncation && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline-offset-2 hover:underline"
          >
            {expanded ? "Show Less" : "See More"}
          </button>
        )}
      </span>
    );
  });

  return (
    <div className="rounded-xl sm:rounded-2xl bg-white/70 p-4 sm:p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl dark:bg-gray-800/70 dark:hover:bg-gray-800/80">
      {/* Question Header */}
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
        <QuestionAuthor
          author={question.author}
          displayDate={displayDate}
          isEdited={isEdited}
        />

        {isOwner && (
          <OwnerMenu
            showMenu={showMenu}
            onToggleMenu={toggleMenu}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Question Title */}
      <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-medium leading-tight text-gray-900 dark:text-white break-words">
        {question.title}
      </h3>

      {/* Question Content */}
      <div className="mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 break-words [&_a]:text-blue-500 [&_a]:underline [&_a]:cursor-pointer [&_a]:hover:text-blue-600">
        <ExpandableContent
          content={question.content}
          threshold={300}
          className="text-gray-700 dark:text-gray-300"
        />
      </div>

      {/* Files (Images and Documents) */}
      <QuestionFiles
        files={question.images}
        onFileClick={handleFileClick}
      />

      {/* Tags */}
      <QuestionTags tags={question.tags} />

      {/* Actions */}
      <QuestionActions
        isLiked={isLiked}
        likes={question.likes}
        comments={question.comments}
        showComments={showComments}
        isLiking={isLiking}
        onLike={handleLike}
        onToggleComments={toggleComments}
      />

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 sm:mt-6 border-t border-gray-100 pt-4 sm:pt-6 dark:border-gray-700">
          <CommentSection 
            questionId={question.id} 
            loggedIn={loggedIn} 
            setQuestions={setQuestions}
            questionAuthorId={question.author.id} 
            onSolutionMarked={onSolutionMarked}
          />
        </div>
      )}

      {/* File Preview Modal */}
      {selectedFile && (
        <QuestionImagePreview
          isOpen={true}
          onClose={closeFilePreview}
          imageSrc={selectedFile.src}
          imageAlt={selectedFile.alt}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <PostQuestionModal
          isOpen={showEditModal}
          onClose={closeEditModal}
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