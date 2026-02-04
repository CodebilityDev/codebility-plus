"use client";

type RichTextDisplayProps = {
  content: string;
};

export default function KanbanRichTextDisplay({ content }: RichTextDisplayProps) {
  return (
    <div 
      className="tiptap-display prose prose-sm max-w-none text-white"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}