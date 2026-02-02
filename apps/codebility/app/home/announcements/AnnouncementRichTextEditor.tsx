"use client";

import { useEffect, useRef } from "react";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import AnnouncementRichTextEditorMenuBar from "./AnnouncementRichTextEditorMenuBar";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AnnouncementRichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const didInit = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] bg-transparent py-2 px-3 break-words overflow-hidden w-full focus:outline-none",
      },
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));

        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const src = reader.result as string;
              editor?.chain().focus().setImage({ src }).run();
            };
            reader.readAsDataURL(file);
          }
          return true;
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      // When the editor content changes, update the parent component with the new HTML
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor && editor.isEmpty && value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div>
      <AnnouncementRichTextEditorMenuBar editor={editor} />
      <div className="tiptap-editor max-w-full overflow-x-hidden break-words text-foreground rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}