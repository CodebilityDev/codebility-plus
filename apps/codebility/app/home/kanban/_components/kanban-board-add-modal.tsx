import type { Project } from "@/types/home/codev";
import { Button } from "@/Components/ui/button";
import Input from "@/Components/ui/forms/input";
import { IconAdd, IconDropdown } from "@/public/assets/svgs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@codevs/ui/dialog";
import { Label } from "@codevs/ui/label";

import { createNewBoard } from "../actions";

export default async function KanbanBoardAddModal() {
  const supabase = getSupabaseServerComponentClient();
  const { data: projects } = await supabase.from("project").select();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex w-max items-center gap-2">
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
            <DialogTitle className="mb-2 text-left text-lg">
              Add New Board
            </DialogTitle>
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
                    <SelectValue
                      className="text-sm"
                      placeholder="Select a Project"
                    />
                    <IconDropdown className="invert dark:invert-0" />
                  </SelectTrigger>

                  <SelectContent className="border-light_dark dark:bg-black-100 rounded-md border bg-[#FFF]">
                    <SelectGroup>
                      <SelectLabel className="text-gray px-3 py-2 text-xs">
                        Projects
                      </SelectLabel>
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
                <Input id="name" type="text" name="name" />
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <DialogClose asChild>
              <Button
                variant="hollow"
                className="order-2 w-full sm:order-1 sm:w-[130px]"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="default"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
