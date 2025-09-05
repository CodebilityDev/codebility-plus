"use client";

import { useEffect, useState } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import getRandomColor from "@/lib/getRandomColor";
import { Codev } from "@/types/home/codev";

import CodevCard from "./CodevCard";
import CodevListFilter from "./CodevListFilter";

interface Props {
  codevs: Codev[];
}

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
  } = usePagination(toPaginateUser, pageSize.codevsList);

  useEffect(() => {
    const filteredPosition = () => {
      if (!selectedPosition) {
        setToPaginateUser(codevs);
        return;
      }

      // Filter users based on the selected displayed position
      const filteredUser = codevs.filter(
        (codev) => codev.display_position === selectedPosition,
      );
      setToPaginateUser(filteredUser);
    };

    filteredPosition();
  }, [selectedPosition, codevs]);

  if (codevs.length === 0) {
    return (
      <p className="text-gray text-center text-2xl">Sorry, no data found.</p>
    );
  }

  return (
    <div className="m-auto h-full w-full max-w-6xl">
      <CodevListFilter
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
        users={codevs}
      />
      <div
        className={`grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
          paginatedUsers.length < 5 ? "xl:grid-cols-4" : "xl:grid-cols-5"
        }`}
      >
        {paginatedUsers.map((codev) => (
          <CodevCard
            color={getRandomColor() || ""}
            key={codev.id}
            codev={codev}
          />
        ))}
      </div>
      <div className="text-white">
        {codevs.length > pageSize.codevsList && (
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
