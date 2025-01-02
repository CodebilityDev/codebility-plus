import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";
import InternCard from "./intern-card";

const InternList = ({
  data,
  filters,
}: {
  data: Codev[];
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
  } = usePagination<Codev>(filteredInterns, pageSize.interns);

  return (
    <>
      {paginatedInterns.length > 0 ? (
        <div className="grid place-items-center gap-6 md:grid-cols-2 xl:grid-cols-4">
          {paginatedInterns.map((intern: Codev) => (
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
