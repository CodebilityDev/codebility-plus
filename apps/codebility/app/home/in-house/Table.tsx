import * as React from "react"
import TableHeader from "@/app/home/in-house/TableHeader"
import TableBody from "@/app/home/in-house/TableBody"
import EditTabelBody from "@/app/home/in-house/EditTableBody"
import { IInhouse, TeamMemberT } from "@/types/index"
import DefaultPagination from "@/Components/ui/pagination"

function Tables({
  data,
  editableIds,
  handlers,
  status,
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}: IInhouse) {
  const { setData, handleEditButton, handleSaveButton } = handlers
  const { LoadinginHouse, ErrorinHouse } = status

  const handleTableHeaderButton = (key: keyof TeamMemberT, direction: "up" | "down") => {
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
                <EditTabelBody key={member.id} member={member} handleSaveButton={handleSaveButton} />
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