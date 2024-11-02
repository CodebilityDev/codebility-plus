"use client";

import { useState } from "react";
import { passwordChangeSchema } from "@/schema/account-settings-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@codevs/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@codevs/ui/form";
import { Input } from "@codevs/ui/input";

import { updatePassword } from "../action";

export default function AccountSettingsChangePassword({
  email,
}: {
  email: string;
}) {
  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof passwordChangeSchema>) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("currentPassword", values.currentPassword);
    formData.append("newPassword", values.newPassword);

    try {
      const result = await updatePassword(formData);

      if (result.success) {
        toast.success("Password updated successfully!");
        form.reset();
      } else {
        toast.error("Failed to update password");
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const isFormValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;
  const isDirty = form.formState.isDirty;
  const isButtonDisabled = isSubmitting || !isFormValid || !isDirty;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Change Password</h3>
      <Form {...form}>
        <form
          className="space-y-2"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Current Password"
                    label="Current Password"
                    parentClassName="flex gap-2 flex-col"
                    variant="lightgray"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    label="New Password"
                    parentClassName="flex gap-2 flex-col"
                    variant="lightgray"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    parentClassName="flex gap-2 flex-col"
                    variant="lightgray"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-blue-200 text-white duration-300 hover:bg-blue-300 md:w-auto"
            disabled={isButtonDisabled}
          >
            {form.formState.isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
