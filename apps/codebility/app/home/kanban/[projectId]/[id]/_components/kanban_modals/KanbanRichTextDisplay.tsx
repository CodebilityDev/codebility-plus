"use client";

import { sanitizeHtml } from "@/utils/sanitize-html";

type RichTextDisplayProps = {
  content: string;
};

export default function KanbanRichTextDisplay({ content }: RichTextDisplayProps) {


  return (
    <div 
      className="tiptap-display prose prose-sm max-w-none text-white"
      //sanitize the content before rendering to prevent XSS attacks
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  );
}