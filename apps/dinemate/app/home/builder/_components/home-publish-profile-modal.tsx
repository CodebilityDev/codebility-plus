'use client'

import { Button } from '@codevs/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { toast, Toaster } from '@codevs/ui/sonner-toast'
import { useRouter } from 'next/navigation'
import appConfig from '~/config/app.config'
import useCard from '../_hooks/useCard'
import { publishProfile } from '../actions'

const formSchema = z.object({
  usernameURL: z.string().min(4),
})

function HomePublishProfileModal() {
  const { cardData } = useCard()
  const router = useRouter()

  const usernameURL =
    cardData.username_url &&
    cardData.username_url.split('://')[1]?.split('.')[0]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameURL,
    },
  })

  const { reset } = form

  const [protocol, host] = appConfig.url.split('://')

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { usernameURL } = values

    try {
      await publishProfile(
        `${protocol}://${usernameURL}.${host}`,
        usernameURL,
        cardData.id,
      )
      toast.success('Profile Published!')
      reset()
      router.refresh()
    } catch (e) {
      toast.error((e as { message: string }).message)
    }
  }

  return (
    <Dialog>
      <Toaster richColors position="top-right" />
      <DialogTrigger asChild>
        <Button>Publish Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Publish Profile</DialogTitle>
              <DialogDescription>
                A magical command that brings your vision to life.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-5 mt-3 flex flex-col gap-y-4">
              <div className="relative flex flex-col gap-y-5">
                <FormField
                  control={form.control}
                  name="usernameURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="usernameURL" className="font-bold">
                        Enter your public username URL
                      </FormLabel>
                      <div className="bg-gray text-md bg-background/40 relative flex items-center px-2 py-1">
                        <div className="font-bold">{protocol}://</div>
                        <FormControl>
                          <input
                            type="text"
                            id="usernameURL"
                            className="bg-input border font-medium"
                            placeholder=""
                            {...field}
                            defaultValue={usernameURL ? usernameURL : ''}
                            onChange={(e) => {
                              const value = e.target.value
                              const allowedPattern = /^[a-zA-Z0-9]*$/

                              if (!allowedPattern.test(value)) return

                              form.setValue('usernameURL', value)
                            }}
                          />
                        </FormControl>
                        <div className="font-bold">.{host}</div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div>
              <Button role="submit" type="submit" className="w-full">
                Publish
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default HomePublishProfileModal
