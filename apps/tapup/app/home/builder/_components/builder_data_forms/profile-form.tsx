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
import useBuilderFormData from '../../_hooks/useBuilderFormData'
import { Toaster, toast } from '@codevs/ui/sonner-toast'

import {
  profileFormSchema as formSchema,
  profileDatasDefault as defaultValues,
} from '../../_lib/builder-data-form-datas'
import { updateBuilderProfileData } from '../../actions'
import useCard from '../../_hooks/useCard'

function ProfileDataForm() {
  const { updateProfileDatas } = useBuilderFormData()
  const { cardData } = useCard()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function handleUpdate() {
    updateProfileDatas(JSON.stringify(form.getValues()))
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateBuilderProfileData(cardData.id, values)
      toast.success('Updated')
    } catch (e) {
      toast.error((e as { message: string }).message)
    }
  }

  return (
    <div className="my-8 px-8">
      <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <p className="mb-3 text-sm text-gray-400">
            Make changes to your account here. Click save when you're done
          </p>
          <div className="flex flex-col gap-y-3">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel htmlFor="displayName" className="font-medium">
                      Display Name
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        id="displayName"
                        className="rounded border border-gray-300 px-3 py-1"
                        placeholder=" "
                        {...field}
                        onChange={(e) => {
                          form.setValue('name', e.target.value)
                          handleUpdate()
                        }}
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
                        type="text"
                        id="coverPhoto"
                        className="hidden"
                        {...field}
                      />
                    </FormControl>
                    <input
                      type="file"
                      className="flex rounded border border-gray-300 px-3 py-1"
                      placeholder=" "
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0)
                          return
                        form.setValue(
                          'coverPhoto',
                          URL.createObjectURL(e.target.files[0] as Blob),
                        )
                        handleUpdate()
                      }}
                    />
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
              name="industryRole"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex flex-col gap-y-2">
                    <FormLabel htmlFor="industryRole" className="font-medium">
                      Industry Role
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        id="industryRole"
                        className="rounded border border-gray-300 px-3 py-1"
                        {...field}
                        onChange={(e) => {
                          form.setValue('industryRole', e.target.value)
                          handleUpdate()
                        }}
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
                        onChange={(e) => {
                          form.setValue('bio', e.target.value)
                          handleUpdate()
                        }}
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
