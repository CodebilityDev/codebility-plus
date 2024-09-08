import React, { useRef } from 'react'

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
import useProfile from '~/hooks/useProfile'
import { Toaster, toast } from '@codevs/ui/sonner-toast'
import { v4 } from 'uuid'
import { useSupabase } from '@codevs/supabase/hooks/use-supabase'
import { manageProfileFormSchema as formSchema } from '~/lib/profile-data'
import { updateBuilderProfileData } from '../../actions'
import useCard from '../../_hooks/useCard'

function ProfileDataForm() {
  const supabase = useSupabase()
  const { updateProfileDatas, profileDatas } = useProfile()
  const { cardData } = useCard()

  const coverPhotoRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: profileDatas,
  })

  function handleUpdate() {
    updateProfileDatas(JSON.stringify(form.getValues()))
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const coverPhoto = coverPhotoRef.current?.files?.[0]

      if (coverPhoto) {
        // upload image to the supabase bucket
        const fileName = `cover-${v4() + coverPhoto.name.split('.').pop()}`
        const filePath = `${fileName}`

        const { error } = await supabase.storage
          .from('profile images')
          .upload(filePath, coverPhoto)

        if (error) throw error

        // get the uploaded image public url
        const { data: url } = await supabase.storage
          .from('profile images')
          .getPublicUrl(filePath)

        await updateBuilderProfileData(
          cardData.id,
          Object.assign(values, { coverPhoto: url.publicUrl }),
        )
      } else await updateBuilderProfileData(cardData.id, values)

      toast.success('Updated')
    } catch (e) {
      toast.error((e as { message: string }).message)
    }
  }

  return (
    <div className="bg-card px-8 py-8">
      <Toaster richColors position="top-right" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <p className="text-foreground/90 mb-3 text-sm">
            Make changes to your account here. Click save when you&lsquo;re done
          </p>
          <div className="text-foreground flex flex-col gap-y-3">
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
                        className="text-foreground dark:bg-input border-border rounded border px-3 py-1"
                        placeholder=" "
                        {...field}
                        onChange={(e) => {
                          form.setValue('displayName', e.target.value)
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
                        className="text-foreground dark:bg-input hidden "
                        {...field}
                      />
                    </FormControl>
                    <input
                      ref={coverPhotoRef}
                      type="file"
                      className="text-foreground dark:bg-input border-border flex rounded border px-3 py-1"
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
                        className="text-foreground dark:bg-input border-border rounded border px-3 py-1"
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
                        className="text-foreground dark:bg-input border-border rounded border px-3 py-1"
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
                        className="text-foreground dark:bg-input border-border rounded border px-3 py-1"
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
                        className="text-foreground dark:bg-input border-border rounded border px-3 py-1"
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
                        className="text-foreground dark:bg-input border-border rounded border px-3 py-1 text-sm"
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
