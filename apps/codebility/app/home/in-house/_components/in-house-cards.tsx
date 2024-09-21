import * as React from "react";
import DefaultPagination from "@/Components/ui/pagination";

import { InHouseProps } from "../_types/in-house";
import Card from "./in-house-card";
import EditableCard from "./in-house-editable-card";

export default function InHouseCards({
  data,
  editableIds,
  handlers,
  status,
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}: InHouseProps) {
  const { handleEditButton, handleSaveButton } = handlers;
  const { LoadinginHouse, ErrorinHouse } = status;

  if (LoadinginHouse) <>LOADING</>;

  if (ErrorinHouse) <>ERROR</>;

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 lg:hidden">
        {data.map((member: any) =>
          editableIds.includes(member.id) ? (
            <EditableCard
              key={member.id}
              data={member}
              handleSaveButton={handleSaveButton}
            />
          ) : (
            <Card
              key={member.id}
              member={member}
              handleEditButton={handleEditButton}
            />
          ),
        )}
      </div>
      <div className="mt-4 flex justify-end text-right text-muted-foreground lg:hidden">
        {data.length === 1
          ? `${data.length} item`
          : data.length > 0
            ? `${data.length} items`
            : "The applicants list is empty at the moment."}
      </div>
      <div className="flex h-full w-full items-center justify-center lg:hidden">
        <DefaultPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}
