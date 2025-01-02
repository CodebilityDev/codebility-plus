"use client";

import DefaultPagination from "@/Components/ui/pagination";
import { Table, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import usePagination from "@/hooks/use-pagination";
import { PAGE_SIZE, TABLE_HEADERS } from "../_lib/constants";
import ServiceList from "./service-list";

const ServiceTable = ({ data }: { data: any }) => {
  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePreviousPage,
    handleNextPage,
  } = usePagination(data, PAGE_SIZE);

  return (
    <div>
      <Table className="text-dark100_light900 mt-8 w-full table-fixed overflow-auto">
        <TableHeader className="background-lightbox_darkbox border-top hidden text-xl lg:grid">
          <TableRow className="lg:grid lg:grid-cols-8">
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header}
                className={`table-border-light_dark border-b-[1px] p-4 text-left text-xl font-light ${header === "Edit" || header === "Delete" ? "text-center" : "col-span-2"}`}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <ServiceList data={paginatedData} />
      </Table>
      {data.length > PAGE_SIZE && (
        <DefaultPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default ServiceTable;
