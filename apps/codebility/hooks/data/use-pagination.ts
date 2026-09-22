"use client";

import { useEffect, useState } from "react";

const usePagination = <T>(data: T[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const startIndex = Math.max(0, (currentPage - 1) * pageSize);
  const endIndex = Math.min(data.length, currentPage * pageSize);
  
  const paginatedData = data.slice(startIndex, endIndex);

  const { length: lenghtOfData } = data;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const newTotalPages = Math.ceil(lenghtOfData / pageSize) || 1;
    setTotalPages(newTotalPages);

    // Reset to page 1 if current page exceeds new total pages
    setCurrentPage((prev) => {
      if (prev > newTotalPages) {
        return 1;
      }
      return prev;
    });
  }, [data, lenghtOfData, pageSize]);

  return {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    handlePreviousPage,
    handleNextPage,
  };
};

export default usePagination;
