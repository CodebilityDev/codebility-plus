import React from 'react'

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
import { Button } from '@codevs/ui/button'

const formSchema = z.object({
  name: z.string().min(1),
  coverPhoto: z.string().min(1),
  businessEmail: z.string().min(8),
  businessContact: z.string().min(8),
  businessIndustry: z.string().min(8),
  bio: z.string().min(8),
})

function ProfileDataForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      coverPhoto: '',
      businessEmail: '',
      businessContact: '',
      businessIndustry: '',
      bio: '',
    },
  })
  return (
    <div className="my-8 px-8">
      <Form {...form}>
        <form>
          <p className="mb-3 text-sm text-gray-400">
            Make changes to your account here. Click save when you're done
          </p>
          <div className="flex flex-col gap-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel htmlFor="name" className="font-medium">
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        id="name"
                        className="rounded border border-gray-300 px-3 py-1"
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
              name="coverPhoto"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel htmlFor="coverPhoto" className="font-medium">
                      Cover Photo
                    </FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        id="coverPhoto"
                        className="flex rounded border border-gray-300 px-3 py-1"
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
              name="businessEmail"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel htmlFor="businessEmail" className="font-medium">
                      Business Email
                    </FormLabel>
                    <FormControl>
                      <input
                        type="email"
                        id="businessEmail"
                        className="rounded border border-gray-300 px-3 py-1"
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
              name="businessContact"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel
                      htmlFor="businessContact"
                      className="font-medium"
                    >
                      Business Contact
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        id="businessContact"
                        className="rounded border border-gray-300 px-3 py-1"
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
              name="businessIndustry"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel
                      htmlFor="businessIndustry"
                      className="font-medium"
                    >
                      Business Industry
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        id="businessIndustry"
                        className="rounded border border-gray-300 px-3 py-1"
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel htmlFor="bio" className="font-medium">
                      Bio Description
                    </FormLabel>
                    <FormControl>
                      <textarea
                        rows={5}
                        id="bio"
                        className="rounded border border-gray-300 px-3 py-1 text-sm"
                        placeholder="Type your short message here"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Save Changes</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ProfileDataForm
