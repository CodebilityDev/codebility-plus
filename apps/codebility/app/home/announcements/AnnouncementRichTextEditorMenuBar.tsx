"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Undo,
  Redo,
  Image as ImageIcon,
} from "lucide-react";

type MenuBarProps = {
  editor: Editor | null;
};

export default function AnnouncementRichTextEditorMenuBar({
  editor,
}: MenuBarProps) {
  if (!editor) {
    return null;
  }

  const handleImageUpload = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border border-b-0 border-gray-300 dark:border-gray-700 rounded-t-md bg-gray-50 text-foreground dark:bg-gray-800 p-2">
      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Undo"
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("heading", { level: 1 })
            ? "bg-gray-300 dark:bg-gray-600"
            : ""
        }`}
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("heading", { level: 2 })
            ? "bg-gray-300 dark:bg-gray-600"
            : ""
        }`}
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("heading", { level: 3 })
            ? "bg-gray-300 dark:bg-gray-600"
            : ""
        }`}
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("bold") ? "bg-gray-300 dark:bg-gray-600" : ""
        }`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("italic") ? "bg-gray-300 dark:bg-gray-600" : ""
        }`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("strike") ? "bg-gray-300 dark:bg-gray-600" : ""
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("highlight") ? "bg-gray-300 dark:bg-gray-600" : ""
        }`}
        title="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("bulletList") ? "bg-gray-300 dark:bg-gray-600" : ""
        }`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive("orderedList") ? "bg-gray-300 dark:bg-gray-600" : ""
        }`}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Text Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive({ textAlign: "left" })
            ? "bg-gray-300 dark:bg-gray-600"
            : ""
        }`}
        title="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive({ textAlign: "center" })
            ? "bg-gray-300 dark:bg-gray-600"
            : ""
        }`}
        title="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
          editor.isActive({ textAlign: "right" })
            ? "bg-gray-300 dark:bg-gray-600"
            : ""
        }`}
        title="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      {/* Image */}
      <button
        onClick={handleImageUpload}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Insert Image"
      >
        <ImageIcon className="h-4 w-4" />
      </button>
    </div>
  );
}