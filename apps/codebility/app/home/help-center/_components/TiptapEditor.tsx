"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Link from "@tiptap/extension-link";
import { createLowlight, common } from "lowlight";
import {
  Bold,
  Code,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
} from "lucide-react";

const lowlight = createLowlight(common);

type TiptapEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** "compact" (reply box, ~72px) or "roomy" (question description, ~160px) */
  size?: "compact" | "roomy";
};

export function TiptapEditor({
  value,
  onChange,
  placeholder = "Write something...",
  size = "compact",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    editorProps: {
      attributes: {
        class: `prose prose-sm dark:prose-invert max-w-none overflow-y-auto px-3 py-2 focus:outline-none ${
          size === "roomy" ? "min-h-[160px] max-h-72" : "min-h-[72px] max-h-40"
        }`,
      },
    },
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl ?? "");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50/60 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-800/40">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold">
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic">
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} label="Strikethrough">
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} label="Inline code">
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("link")} onClick={setLink} label="Link">
          <Link2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet list">
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Numbered list">
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Quote">
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
  label,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-7 w-7 items-center justify-center rounded ${
        active
          ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}