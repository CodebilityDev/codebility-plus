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
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast, Toaster } from '@codevs/ui/toast'
import { UserWorkspaceContext } from '../../_components/user-workspace-context'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@codevs/ui/input-otp'
import { activateCard } from '../actions'

const formSchema = z.object({
  code: z.string(),
})

interface Props {
  cardId: string
}

function HomeActivateCardModal({ cardId }: Props) {
  const user = useContext(UserWorkspaceContext)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  })

  const { reset } = form

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { code } = values
    try {
      await activateCard(user.id, cardId, code)
      toast.success('Card Activated!')
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
        <Button className="h-0 p-0 text-xs underline">Activate Card</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <h3>Activate Card </h3>
                <h6 className="text-xs text-gray-600">Card ID: {cardId}</h6>
              </DialogTitle>
              <DialogDescription>
                A magical command that brings your vision to life.
              </DialogDescription>
            </DialogHeader>
            <div className="my-6 flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-5">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative flex flex-col gap-y-2">
                        <FormLabel htmlFor="name" className="">
                          Enter Activation Code:
                        </FormLabel>
                        <div className="flex justify-center">
                          <FormControl>
                            <InputOTP maxLength={4} {...field}>
                              <InputOTPGroup>
                                <InputOTPSlot
                                  index={0}
                                  className="size-20 text-6xl"
                                />
                                <InputOTPSlot
                                  index={1}
                                  className="size-20 text-6xl"
                                />
                                <InputOTPSlot
                                  index={2}
                                  className="size-20 text-6xl"
                                />
                                <InputOTPSlot
                                  index={3}
                                  className="size-20 text-6xl"
                                />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <Button role="submit" type="submit">
                Activate
              </Button>
            </div>
            <DialogFooter className="sm:justify-start"></DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default HomeActivateCardModal