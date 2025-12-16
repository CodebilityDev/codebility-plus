"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { X, Upload, AlertCircle, Bold, Italic, Code, List, ListOrdered, Undo, Redo } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";
import { Alert, AlertDescription } from "@codevs/ui/alert";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  authorId: string;
}

interface PostQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    id: string,
    title: string;
    content: string;
    tags: string[];
    images: string[];
    authorId: string;
  }) => void;
  editQuestion?: Question | null;
  mode?: 'create' | 'edit';
}

// Memoized MenuBar component
const MenuBar = memo(function MenuBar({ editor }: { editor: any }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Inline Code"
      >
        <Code className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`h-8 px-3 text-xs ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="Code Block"
      >
        {'</>'}
      </Button>
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="h-8 w-8 p-0"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="h-8 w-8 p-0"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
});

// Memoized ImagePreview component
const ImagePreview = memo(function ImagePreview({
  image,
  index,
  onRemove,
}: {
  image: string;
  index: number;
  onRemove: (index: number) => void;
}) {
  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="relative group aspect-video rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
      <Image
        src={image}
        alt={`Screenshot ${index + 1}`}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
      <Button
        type="button"
        size="sm"
        onClick={handleRemove}
        className="absolute right-2 top-2 h-7 w-7 rounded-full bg-red-500 p-0 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity shadow-lg"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
});

// Memoized ImageUploadSection component
const ImageUploadSection = memo(function ImageUploadSection({
  images,
  uploadingImages,
  onUpload,
  onRemove,
}: {
  images: string[];
  uploadingImages: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Screenshots {images.length > 0 && <span className="text-gray-500">({images.length}/5)</span>}
      </Label>
      <div className="flex items-center gap-3">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={onUpload}
          disabled={uploadingImages || images.length >= 5}
          className="hidden"
          id="image-upload"
        />
        <Label
          htmlFor="image-upload"
          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
            uploadingImages || images.length >= 5
              ? 'cursor-not-allowed opacity-50 bg-gray-100 dark:bg-gray-800'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {uploadingImages ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {images.length >= 5 ? 'Max images reached' : 'Upload Images'}
            </>
          )}
        </Label>
        <p className="text-xs text-gray-500">
          JPG, PNG, GIF • Max 10MB • Compressed on upload
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          {images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500">
        Images will be automatically compressed during upload. Tap to remove.
      </p>
    </div>
  );
});

export default function PostQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  editQuestion = null,
  mode = 'create',
}: PostQuestionModalProps) {
  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const isEditMode = mode === 'edit' && editQuestion;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: 'Describe your problem in detail. Include:\n• What you\'re trying to achieve\n• What you\'ve tried so far\n• Any error messages\n• Code snippets (if relevant)',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[250px] p-4 text-gray-900 dark:text-white dark:prose-invert',
      },
    },
  });

  // Memoize resetForm
  const resetForm = useCallback(() => {
    setTitle("");
    editor?.commands.setContent('');
    setTagsInput("");
    setImages([]);
    setError(null);
  }, [editor]);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editor) {
      setTitle(editQuestion.title);
      editor.commands.setContent(editQuestion.content);
      setTagsInput(editQuestion.tags.join(", "));
      setImages(editQuestion.images || []);
    } else if (editor && !isEditMode) {
      resetForm();
    }
  }, [isEditMode, editQuestion, isOpen, editor, resetForm]);

  // Memoize handleSubmit
  const handleSubmit = useCallback(async () => {
    setError(null);

    if (!title.trim()) {
      setError("Please enter a question title");
      return;
    }
    if (title.trim().length < 10) {
      setError("Question title must be at least 10 characters");
      return;
    }

    const content = editor?.getHTML() || '';
    const textContent = editor?.getText() || '';
    
    if (!textContent.trim()) {
      setError("Please provide question details");
      return;
    }
    if (textContent.trim().length < 20) {
      setError("Question details must be at least 20 characters");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    setSubmitting(true);

    try {
      if (isEditMode && editQuestion) {
        await onSubmit({
          id: editQuestion.id,
          authorId: editQuestion.authorId,
          title: title.trim(),
          content: content,
          tags,
          images,
        });
      } else {
        await onSubmit({
          id: "",
          authorId: "",
          title: title.trim(),
          content: content,
          tags,
          images,
        });
      }

      if (!isEditMode) {
        resetForm();
      }
      onClose();
    } catch (e) {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [title, editor, tagsInput, images, isEditMode, editQuestion, onSubmit, resetForm, onClose]);

  // Memoize handleImageUpload
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError(null);

    try {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          if (file.size > 10 * 1024 * 1024) {
            reject(new Error(`${file.name} is too large. Max size is 10MB.`));
            return;
          }

          if (!file.type.startsWith('image/')) {
            reject(new Error(`${file.name} is not a valid image file.`));
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            } else {
              reject(new Error(`Failed to read ${file.name}`));
            }
          };
          reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
          reader.readAsDataURL(file);
        });
      });

      const uploadedImages = await Promise.all(imagePromises);
      
      if (images.length + uploadedImages.length > 5) {
        setError("Maximum 5 images allowed per question");
        return;
      }

      setImages(prev => [...prev, ...uploadedImages]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload images';
      setError(errorMessage);
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  }, [images.length]);

  // Memoize removeImage
  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  // Memoize handleClose
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Memoize handleKeyDown
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Memoize handleTitleChange
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError(null);
  }, []);

  // Memoize handleTagsChange
  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`max-w-2xl max-h-[90vh] text-red-600 dark:bg-slate-950 flex flex-col p-0 ${submitting ? "backdrop-blur-sm pointer-events-none" : ""}`}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditMode ? 'Edit Question' : 'Ask a Question'}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto flex-1 px-6">
          <div className="space-y-5 py-5" onKeyDown={handleKeyDown}>
            {error && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., How to handle async state in React?"
                value={title}
                onChange={handleTitleChange}
                maxLength={150}
                className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-2 focus:ring-customBlue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {title.length}/150 characters • Be specific and clear
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Question Details <span className="text-red-500">*</span>
              </Label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {editor?.storage.characterCount?.characters() || 0} characters • Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600">Ctrl+Enter</kbd> to submit
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="e.g., React, TypeScript, CSS"
                value={tagsInput}
                onChange={handleTagsChange}
                className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:ring-2 focus:ring-customBlue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Separate tags with commas • Helps others find your question
              </p>
            </div>

            <ImageUploadSection
              images={images}
              uploadingImages={uploadingImages}
              onUpload={handleImageUpload}
              onRemove={removeImage}
            />
          </div>
        </div>

        <div className="flex justify-between items-center gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-950">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: {isEditMode ? 'Update your question to make it clearer' : 'Clear questions get better answers faster'}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
              className="border-foreground text-white hover:text-white bg-red-500 border-gray-600 hover:bg-red-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={uploadingImages || submitting || !title.trim() || !editor?.getText().trim()}
              className="bg-gradient-to-r from-customBlue-500 to-indigo-500 hover:from-customBlue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isEditMode ? 'Update Question' : 'Post Question'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Memoized QuestionContentDisplay component
export const QuestionContentDisplay = memo(function QuestionContentDisplay({ 
  content, 
  className = '' 
}: { 
  content: string; 
  className?: string;
}) {
  const displayEditor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none text-gray-900 dark:text-white dark:prose-invert ${className}`,
      },
    },
  });
  
  useEffect(() => {
    if (displayEditor && content !== displayEditor.getHTML()) {
      displayEditor.commands.setContent(content);
    }
  }, [content, displayEditor]);
  
  return <EditorContent editor={displayEditor} />;
});