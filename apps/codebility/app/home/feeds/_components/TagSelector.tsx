"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@codevs/ui/checkbox";

import { getPostTagsLookup } from "../_services/query";

interface TagSelectorProps {
  selectedTags?: number[];
  onChange?: (selectedTagIds: number[]) => void;
}

interface Tag {
  id: number;
  name: string;
  selected: boolean;
}

const TagSelector = ({ selectedTags = [], onChange }: TagSelectorProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await getPostTagsLookup();
        if (!data) return;

        const mappedTags: Tag[] = data.map((t) => ({
          id: t.id,
          name: t.name,
          selected: selectedTags.includes(t.id),
        }));

        setTags(mappedTags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (id: number) => {
    const updatedTags = tags.map((t) =>
      t.id === id ? { ...t, selected: !t.selected } : t,
    );
    setTags(updatedTags);

    if (onChange) {
      const selectedIds = updatedTags
        .filter((t) => t.selected)
        .map((t) => t.id);
      onChange(selectedIds);
    }
  };

  return (
    <div className="mt-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Hide Tags" : "Select Tags"}
      </Button>

      {isOpen && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1">
              <Checkbox
                checked={tag.selected}
                onCheckedChange={() => toggleTag(tag.id)}
              />
              <span className="text-sm">{tag.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
