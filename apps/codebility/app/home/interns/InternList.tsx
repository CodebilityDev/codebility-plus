import React from "react";
import { getInterns } from "@/app/api/interns";
import { positionTitles } from "@/app/home/interns/data";
import InternCard from "@/app/home/interns/InternCard";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { User } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const Intern = ({
  filters,
}: {
  filters: Partial<(typeof positionTitles)[number]>[];
}) => {
  const {
    data: Interns,
    isLoading: LoadingInterns,
    error: ErrorInterns,
  }: UseQueryResult<User[]> = useQuery({
    queryKey: ["Interns"],
    queryFn: async () => {
      return await getInterns();
    },
    refetchInterval: 3000,
  });

  const filteredInterns = Array.isArray(Interns)
    ? filters.length === 0
      ? Interns
      : Interns.filter((intern) =>
          filters.includes(intern.main_position || "not found"),
        )
    : [];

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedInterns,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination<User>(filteredInterns, pageSize.interns);

  if (LoadingInterns) return;

  if (ErrorInterns) return;

  return (
    <>
      {paginatedInterns.length > 0 ? (
        <div className="xs:grid-cols-2 grid place-items-center gap-6 sm:place-items-start md:grid-cols-3 lg:grid-cols-4">
          {paginatedInterns.map((intern: User) => (
            <InternCard color="" key={intern.id} user={intern} />
          ))}
        </div>
      ) : (
        <p className="text-lightgray text-center text-xl">No interns found</p>
      )}
      {Interns && Interns.length > pageSize.interns && (
        <DefaultPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </>
  );
};

export default Intern;
