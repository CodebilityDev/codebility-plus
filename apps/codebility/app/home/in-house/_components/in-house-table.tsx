import * as React from "react"
import TableHeader from "./in-house-table-header"
import TableBody from "./in-house-table-body"
import EditTabelBody from "./in-house-edit-table-body"
import DefaultPagination from "@/Components/ui/pagination"
import { Codev } from "../_types/codev"
import { InHouseProps } from "../_types/in-house"

function Tables({
  data,
  editableIds,
  handlers,
  status,
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}: InHouseProps) {
  const { setData, handleEditButton, handleSaveButton } = handlers
  const { LoadinginHouse, ErrorinHouse } = status

  const handleTableHeaderButton = (key: keyof Codev, direction: "up" | "down") => {
    const sortedData = [...data].sort((a, b) => {
      const valueA = a[key] ?? ""
      const valueB = b[key] ?? ""
      if (direction === "down") {
        return valueA > valueB ? -1 : 1
      } else {
        return valueA < valueB ? -1 : 1
      }
    })
    setData(sortedData)
  }

  if (LoadinginHouse) <>LOADING</>

  if (ErrorinHouse) <>ERROR</>

  return (
    <>
      <div className="hidden overflow-hidden rounded-md lg:flex ">
        <table className="background-box text-dark100_light900 w-full min-w-[850px] table-fixed">
          <TableHeader onSort={handleTableHeaderButton} />
          <tbody>
            {data?.map((member: any) =>
              editableIds.includes(member.id) ? (
                <EditTabelBody key={member.id} data={member} handleSaveButton={handleSaveButton} />
              ) : (
                <TableBody key={member.id} member={member} handleEditButton={handleEditButton} />
              )
            )}
          </tbody>
        </table>
      </div>
      <div className="hidden justify-end text-muted-foreground lg:flex">
        {data.length === 1
          ? `${data.length} item`
          : data.length > 0
          ? `${data.length} items`
          : "The applicants list is empty at the moment."}
      </div>
      <div className="hidden h-full w-full items-center justify-center lg:flex ">
        <DefaultPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          totalPages={totalPages}
        />
      </div>
    </>
  )
}

export default Tables
