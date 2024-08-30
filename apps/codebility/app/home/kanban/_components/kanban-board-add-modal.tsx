import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
  SelectItemText
} from "@radix-ui/react-select"
import { Label } from "@codevs/ui/label"
import { Button } from "@/Components/ui/button"
import { IconAdd, IconDropdown } from "@/public/assets/svgs"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@codevs/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import type { Project } from "@/types/home/codev"
import Input from "@/Components/ui/forms/input"
import { createNewBoard } from "../actions"

export default async function KanbanBoardAddModal() {
  const supabase = getSupabaseServerComponentClient();
  const { data: projects } = await supabase.from("project")
  .select();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
            variant="default"
            className="flex w-max items-center gap-2"
          >
          <IconAdd />
          <p>Add new board</p>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="background-lightbox_darkbox text-dark100_light900 flex h-auto w-[100%] max-w-3xl flex-col gap-6 overflow-x-auto overflow-y-auto"
        hideCloseButton={false}
      >
        <form action={createNewBoard}>
          <DialogHeader className="relative">
            <DialogTitle className="mb-2 text-left text-lg">Add New Board</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex basis-[50%] flex-col gap-4">
              <div>
                <Label>Project</Label>
                <Select name="projectId">
                  <SelectTrigger
                    aria-label="Projects"
                    className="border-light_dark flex w-full items-center justify-between rounded border bg-transparent px-3 py-2 text-left text-sm focus:outline-none"
                  >
                    <SelectValue className="text-sm" placeholder="Select a Project" />
                    <IconDropdown className="invert dark:invert-0" />
                  </SelectTrigger>

                  <SelectContent className="border-light_dark rounded-md border bg-[#FFF] dark:bg-black-100">
                    <SelectGroup>
                      <SelectLabel className="px-3 py-2 text-xs text-gray">Projects</SelectLabel>
                      {projects?.map(({ id, name }: Project) => (
                        <SelectItem
                          key={id}
                          className="w-[345px] cursor-default px-3 py-2 text-sm hover:bg-blue-100"
                          value={id}
                        >
                          <SelectItemText>{name}</SelectItemText>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" name="name"/>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <DialogClose asChild>
              <Button variant="hollow" className="order-2 w-full sm:order-1 sm:w-[130px]">
                Cancel
              </Button>
            </DialogClose>
            <Button variant="default" className="order-1 w-full sm:order-2 sm:w-[130px]">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}