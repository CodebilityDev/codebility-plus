import React, { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";

import { Button } from "@codevs/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@codevs/ui/form";
import { toast, Toaster } from "@codevs/ui/sonner-toast";

import useProfile from "~/hooks/useProfile";
import { manageProfileFormSchema as formSchema } from "~/lib/profile-data";
import useCard from "../../_hooks/useCard";
import { updateBuilderProfileData } from "../../actions";

function ProfileDataForm() {
  const { updateProfileDatas, profileDatas } = useProfile();
  const { cardData } = useCard();
  const supabase = useSupabase();

  const coverPhotoRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: profileDatas,
  });

  function handleUpdate() {
    updateProfileDatas(JSON.stringify(form.getValues()));
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const coverPhoto = coverPhotoRef.current?.files?.[0];

      if (coverPhoto) {
        // upload image to the supabase bucket
        const fileName = `cover-${v4() + coverPhoto.name.split(".").pop()}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
          .from("profile images")
          .upload(filePath, coverPhoto);

        if (error) throw error;

        // get the uploaded image public url
        const { data: url } = await supabase.storage
          .from("profile images")
          .getPublicUrl(filePath);

        await updateBuilderProfileData(
          cardData.id,
          Object.assign(values, { coverPhoto: url.publicUrl }),
        );
      } else await updateBuilderProfileData(cardData.id, values);

      toast.success("Updated");
    } catch (e) {
      toast.error((e as { message: string }).message);
    }
  };

  return (
    <div className="bg-card px-8 py-8">
      <Toaster richColors position="top-right" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <p className="mb-3 text-sm text-foreground/90">
            Make changes to your account here. Click save when you&lsquo;re done
          </p>
          <div className="flex flex-col gap-y-3 text-foreground">
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
                        className="rounded border border-border px-3 py-1 text-foreground dark:bg-input"
                        placeholder=" "
                        {...field}
                        onChange={(e) => {
                          form.setValue("displayName", e.target.value);
                          handleUpdate();
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
                        className="hidden text-foreground dark:bg-input "
                        {...field}
                      />
                    </FormControl>
                    <input
                      ref={coverPhotoRef}
                      type="file"
                      className="flex rounded border border-border px-3 py-1 text-foreground dark:bg-input"
                      placeholder=" "
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0)
                          return;
                        form.setValue(
                          "coverPhoto",
                          URL.createObjectURL(e.target.files[0] as Blob),
                        );
                        handleUpdate();
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
                        className="rounded border border-border px-3 py-1 text-foreground dark:bg-input"
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
                        className="rounded border border-border px-3 py-1 text-foreground dark:bg-input"
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
                        className="rounded border border-border px-3 py-1 text-foreground dark:bg-input"
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
                        className="rounded border border-border px-3 py-1 text-foreground dark:bg-input"
                        {...field}
                        onChange={(e) => {
                          form.setValue("industryRole", e.target.value);
                          handleUpdate();
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
                        className="rounded border border-border px-3 py-1 text-sm text-foreground dark:bg-input"
                        placeholder="Type your short message here"
                        {...field}
                        onChange={(e) => {
                          form.setValue("bio", e.target.value);
                          handleUpdate();
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
  );
}

export default ProfileDataForm;
