"use client";

import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

export const COLUMN_WIDTH = 288;
export const COLUMN_GAP = 16;
export const COLUMN_STRIDE = COLUMN_WIDTH + COLUMN_GAP;
const COLUMN_OVERSCAN = 2;

export function useKanbanColumnVirtualizer({
  columnOrder,
  keepMountedIds,
}: {
  columnOrder: string[];
  keepMountedIds: ReadonlySet<string>;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const [stripHeight, setStripHeight] = useState(0);

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: columnOrder.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => COLUMN_STRIDE,
    overscan: COLUMN_OVERSCAN,
    getItemKey: (index) => columnOrder[index] ?? index,
  });

  const renderedIndexes = new Set(
    virtualizer.getVirtualItems().map((item) => item.index),
  );

  for (const columnId of keepMountedIds) {
    const index = columnOrder.indexOf(columnId);
    if (index >= 0) {
      renderedIndexes.add(index);
    }
  }

  const indexes = [...renderedIndexes].sort((a, b) => a - b);
  const renderKey = indexes.join("|");

  useEffect(() => {
    const node = stripRef.current;
    if (!node) {
      return;
    }
    const measure = () => {
      let tallest = 0;
      for (const child of Array.from(node.children)) {
        const height = (child as HTMLElement).offsetHeight;
        if (height > tallest) {
          tallest = height;
        }
      }
      setStripHeight((current) => (current === tallest ? current : tallest));
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const child of Array.from(node.children)) {
      observer.observe(child);
    }
    return () => observer.disconnect();
  }, [renderKey]);

  return {
    scrollRef,
    stripRef,
    totalSize: virtualizer.getTotalSize(),
    stripHeight,
    indexes,
  };
}
