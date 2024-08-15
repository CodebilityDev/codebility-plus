'use client'

import { Button } from '@codevs/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@codevs/ui/dialog'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@codevs/ui/form'
import { Input } from '@codevs/ui/input'
import { Label } from '@codevs/ui/label'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast, Toaster } from '@codevs/ui/toast'

const formSchema = z.object({
  name: z.string(),
  role: z.string().min(8),
})

function HomeAddCardModal() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
    },
  })

  const { reset } = form

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    alert(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Card</DialogTitle>
              <DialogDescription>
                A magical command that brings your vision to life.
              </DialogDescription>
            </DialogHeader>
            <div className="my-6 flex flex-col gap-y-4">
              <div className="flex items-center space-x-2 space-y-16">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue="Card Holder Name"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="name">Role</Label>
                  <Input
                    id="role"
                    name="category"
                    defaultValue="Card Holder Role"
                  />
                </div>
              </div>
            </div>
            <Button role="submit" type="submit">
              Create
            </Button>
            <DialogFooter className="sm:justify-start"></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default HomeAddCardModal
