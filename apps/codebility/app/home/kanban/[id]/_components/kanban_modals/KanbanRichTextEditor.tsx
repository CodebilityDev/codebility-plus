"use client";

import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

import { FC } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const KanbanRichTextEditor: FC<RichTextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        className="bg-white text-black dark:bg-transparent dark:text-white"
        placeholder="Start typing here...."
      />
    </div>
  );
};

export default KanbanRichTextEditor;
