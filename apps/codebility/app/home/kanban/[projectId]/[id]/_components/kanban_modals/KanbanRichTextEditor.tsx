"use client";
import { useEffect, useRef } from "react";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import KanbanRichTextEditorMenuBar from "./KanbanRichTextEditorMenuBar";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const isUpdatingFromProps = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc",
          },
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal",
          },
          keepMarks: true,
          keepAttributes: false,
        },
        heading: {
          levels: [1, 2, 3],
        },
        paragraph: {
          HTMLAttributes: {},
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] bg-transparent py-2 px-3 text-foreground focus:outline-none",
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
      if (!isUpdatingFromProps.current) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    const editorHTML = editor.getHTML();
    
    if (value !== editorHTML) {
      isUpdatingFromProps.current = true;
      
      queueMicrotask(() => {
        editor.commands.setContent(value || "", false);
        isUpdatingFromProps.current = false;
      });
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

    return (
    <div className="w-full">
      <KanbanRichTextEditorMenuBar editor={editor} />
      <div className="tiptap-editor max-w-full overflow-x-hidden break-words rounded-md border border-gray-700 bg-transparent p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}