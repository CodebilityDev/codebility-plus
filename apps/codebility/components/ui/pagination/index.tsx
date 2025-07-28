import { Dispatch, SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";

interface DefaultPaginationProps {
  totalPages: number;
  currentPage: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
}

const DefaultPagination = ({
  totalPages,
  currentPage,
  handleNextPage,
  handlePreviousPage,
  setCurrentPage,
}: DefaultPaginationProps) => {
  const pageNumbers: (number | string)[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pageNumbers.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pageNumbers.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
  }

  return (
    <Pagination className="mx-auto mt-8 w-full">
      <PaginationContent className="flex flex-wrap items-center justify-center space-x-1  text-sm dark:text-white sm:text-base">
        <PaginationItem>
          <PaginationPrevious
            className="hover:bg-lightgray  dark:hover:bg-dark-100 cursor-pointer"
            onClick={handlePreviousPage}
          />
        </PaginationItem>
        {pageNumbers.map((num, index) => (
          <PaginationItem key={index + 1}>
            {num === "..." ? (
              <span>...</span>
            ) : (
              <PaginationLink
                className={`hover:bg-lightgray  dark:hover:bg-dark-100 cursor-pointer ${
                  currentPage === num
                    ? "hover:bg-default dark:hover:bg-default border-0 bg-blue-100 text-white hover:text-white"
                    : ""
                }`}
                onClick={() => setCurrentPage && setCurrentPage(Number(num))}
                isActive={currentPage === num}
              >
                {num}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            className="hover:bg-lightgray  dark:hover:bg-dark-100 cursor-pointer"
            onClick={handleNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default DefaultPagination;
