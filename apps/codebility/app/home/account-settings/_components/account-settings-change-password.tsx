"use client";

import { passwordChangeSchema } from "@/schema/account-settings-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export default function AccountSettingsChangePassword() {
  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordChangeSchema>) => {
    console.log(values);
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Change Password</h3>
      <Form {...form}>
        <form
          className="space-y-4"
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
                    label="Current Password"
                    parentClassName="flex gap-2 flex-col"
                    variant={"lightgray"}
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
                    label="New Password"
                    parentClassName="flex gap-2 flex-col"
                    variant={"lightgray"}
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
                    label="Confirm Password"
                    parentClassName="flex gap-2 flex-col"
                    variant={"lightgray"}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className=" bg-blue-200 text-white duration-300 hover:bg-blue-300"
            disabled={!form.formState.isValid}
          >
            Update Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
