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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast, Toaster } from '@codevs/ui/toast'
import { createCard } from '../actions'
import { UserWorkspaceContext } from '../../_components/user-workspace-context'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
})

function HomeAddCardModal() {
  const user = useContext(UserWorkspaceContext)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      role: '',
    },
  })

  const { reset } = form

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, role } = values

    try {
      await createCard(user.id, name, role)
      toast.success('Card Created!')
      reset()
      router.refresh()
    } catch (e) {
      toast.error((e as { message: string }).message)
    }
  }

  return (
    <Dialog>
      <Toaster richColors />
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
              <div className="flex flex-col gap-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative flex flex-col gap-y-2">
                        <FormLabel htmlFor="name" className="">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="name"
                            id="name"
                            className=""
                            placeholder=" "
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative flex flex-col gap-y-2">
                        <FormLabel htmlFor="role" className="">
                          Role
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="role"
                            id="role"
                            className=""
                            placeholder=" "
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
