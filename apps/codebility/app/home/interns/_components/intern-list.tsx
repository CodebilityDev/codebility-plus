import React from "react";

import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { User } from "@/types";
import InternCard from "./intern-card";

const InternList = ({
  data,
  filters,
}: {
  data: User[];
  filters: string[];
}) => {
  
  const filteredInterns = Array.isArray(data)
    ? filters.length > 0
      ? data.filter((intern) =>
          filters.includes(intern.main_position || "not found"),
        )
      : data 
    : [];


  const {
    currentPage,
    totalPages,
    paginatedData: paginatedInterns,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination<User>(filteredInterns, pageSize.interns);

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


      {filteredInterns.length > pageSize.interns && (
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

export default InternList;
