"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { box } from "@/components/FramerAnimation/Framer";
import DefaultPagination from "@/components/ui/pagination";
import usePagination from "@/hooks/data/use-pagination";
import { getStableColor } from "@/utils/getRandomColor";
import { Codev } from "@/types/home/codev";

import CodevCard from "./CodevCard";
import CodevListFilter from "./CodevListFilter";

interface Props {
  codevs: Codev[];
}

const CODEVS_PER_PAGE = 5;

export default function CodevList({ codevs }: Props) {
  const [toPaginateUser, setToPaginateUser] = useState<Codev[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("");

  const {
    paginatedData: paginatedUsers,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(toPaginateUser, CODEVS_PER_PAGE);

  useEffect(() => {
    const filteredPosition = () => {
      if (!selectedPosition) {
        setToPaginateUser(codevs);
        return;
      }

      const filteredUser = codevs.filter(
        (codev) => codev.display_position === selectedPosition,
      );
      setToPaginateUser(filteredUser);
    };

    filteredPosition();
  }, [selectedPosition, codevs]);

  if (codevs.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center text-2xl">Sorry, no data found.</p>
    );
  }

  return (
    <div className="m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevListFilter
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        users={codevs}
      />
      <motion.div
        key={`${selectedPosition}-${currentPage}`}
        variants={box}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="grid h-full w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {paginatedUsers.map((codev) => (
          <CodevCard
            color={getStableColor(codev.id)}
            key={codev.id}
            codev={codev}
          />
        ))}
      </motion.div>
      <div className="mt-6">
        {toPaginateUser.length > CODEVS_PER_PAGE && (
          <DefaultPagination
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}