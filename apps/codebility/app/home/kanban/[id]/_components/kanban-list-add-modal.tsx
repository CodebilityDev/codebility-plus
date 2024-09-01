"use client"

import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@codevs/ui/dialog"
import Input from "@/Components/ui/forms/input"
import { Label } from "@codevs/ui/label"
import toast from "react-hot-toast"
import { IconAdd } from "@/public/assets/svgs"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { KanbanListSchema } from "../_types/kanban-list.schema"
import { z } from "zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { createNewList } from "../actions"
import { useRouter } from "next/navigation"

interface Props {
  boardId: string;
}

export default function KanbanListAddModal({ boardId }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof KanbanListSchema>>({
    resolver: zodResolver(KanbanListSchema)
  })

  const onSubmit = async (values: z.infer<typeof KanbanListSchema>) => {
    const { name } = values;

    try {
      await createNewList(name, boardId);
      toast.success("New List Created!");
      router.refresh(); // show new list.
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex">
          <div className="flex items-center gap-2">
            <IconAdd />
            <p>Add new list</p>
          </div>
        </Button>
      </DialogTrigger>
        <DialogContent
          hideCloseButton={true}
           className="background-lightbox_darkbox text-dark100_light900 h-auto max-w-3xl w-[100%]"
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 overflow-x-auto overflow-y-auto h-full">
            <DialogHeader className="relative">
              <DialogTitle className="mb-2 text-left text-lg">Add New List</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex basis-[50%] flex-col gap-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" {...form.register("name")}/>
                {form.formState.errors.name && <p className="text-destructive">{form.formState.errors.name.message}</p>}
              </div>
            </div>

            <DialogFooter className="flex flex-col gap-2 lg:flex-row">
              <DialogClose asChild onClick={() => form.reset()}>
                <Button variant="hollow" type="button" className="order-2 w-full sm:order-1 sm:w-[130px]">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="default" type="submit" className="order-1 w-full sm:order-2 sm:w-[130px]">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}