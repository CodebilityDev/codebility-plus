import H1 from "@/Components/shared/dashboard/H1"
import KanbanBoardsContainer from "./_components/kanban-boards-container"

export default function KanbanPage() {  
  return (
    <div className="text-dark100_light900 mx-auto flex max-w-7xl flex-col gap-4 ">
      <div className="flex flex-row justify-between gap-4">
        <H1>Codevs Board</H1>
      </div>
      <div className="text-dark100_light900 flex max-w-7xl flex-col gap-4">
        <div className="text-dark100_light900 text-md font-semibold md:text-2xl">BOARDS</div>
        <KanbanBoardsContainer />
      </div>
    </div>
  )
}
