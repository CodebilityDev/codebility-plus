"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@codevs/ui/checkbox";

import { getPostTagsLookup } from "@/actions/feeds/queries";

interface TagSelectorProps {
  selectedTags?: number[];
  onChange?: (selectedTagIds: number[]) => void;
}

const TagSelector = ({ selectedTags = [], onChange }: TagSelectorProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(selectedTags);
  const [isOpen, setIsOpen] = useState(false);

  const { data: tags = [] } = useQuery({
    queryKey: ["feeds", "tags", "lookup"],
    queryFn: () => getPostTagsLookup(),
  });

  const toggleTag = (id: number) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((tagId) => tagId !== id)
      : [...selectedIds, id];

    setSelectedIds(next);
    onChange?.(next);
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
                checked={selectedIds.includes(tag.id)}
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
