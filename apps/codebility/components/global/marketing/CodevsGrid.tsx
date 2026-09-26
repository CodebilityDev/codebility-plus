"use client";

import CodevCard from "@/components/global/marketing/CodevCard";

import { getStableColor } from "@/utils/global/getRandomColor";
import { motion } from "framer-motion";
import type { CodevsGridProps } from "@/types/global/marketing";

export function CodevsGrid({
  codevs,
  page,
}: CodevsGridProps) {
  if (codevs.length === 0) {
    return (
      <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
        Sorry, no data found.
      </p>
    );
  }

  return (
    <div
      key={page}
      className="grid h-full w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {codevs.map((codev, index) => (
        <motion.div
          key={codev.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: "easeOut",
            delay: index * 0.08,
          }}
        >
          <CodevCard
            color={getStableColor(codev.id)}
            codev={codev}
            animateEntrance={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
