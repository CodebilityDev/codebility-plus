"use client";

import { useState } from "react";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import InHouseCards from "./in-house-cards";
import Table from "./in-house-table";

interface Props {
  codevData: Codev[];
}

export default function InHouseContainer({ codevData }: Props) {
  const [data, setData] = useState<Codev[]>(codevData);
  const [editableIds, setEditableIds] = useState<string[]>([]);

  const handleEditButton = (id: string) => {
    setEditableIds((prevIndexes) => [...prevIndexes, id]);
  };

  const handleSaveButton = (updatedMember: Codev) => {
    const updatedData = data.map((member) =>
      member.id === updatedMember.id ? updatedMember : member,
    );
    setData(updatedData);
    setEditableIds((prevIndexes) =>
      prevIndexes.filter((editableId) => editableId !== updatedMember.id),
    );
  };

  const LoadinginHouse = false;
  const ErrorinHouse = null;

  const {
    currentPage,
    totalPages,
    paginatedData,
    handlePreviousPage,
    handleNextPage,
  } = usePagination(data, 10);

  return (
    <div>
      <Table
        data={paginatedData}
        editableIds={editableIds}
        handlers={{
          setData,
          handleEditButton,
          handleSaveButton,
        }}
        status={{
          LoadinginHouse,
          ErrorinHouse,
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
      <InHouseCards
        data={paginatedData}
        editableIds={editableIds}
        handlers={{
          setData,
          handleEditButton,
          handleSaveButton,
        }}
        status={{
          LoadinginHouse,
          ErrorinHouse,
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
}
