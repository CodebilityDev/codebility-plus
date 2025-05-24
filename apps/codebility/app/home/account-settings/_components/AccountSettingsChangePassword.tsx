"use client";

import { createClientClientComponent } from "@/utils/supabase/client";
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

// Password validation schema
const passwordChangeSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function AccountSettingsChangePassword() {
  const supabase = createClientClientComponent();

  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof passwordChangeSchema>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully!");
      form.reset();
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
            name="password"
            render={({ field }: { field: any }) => (
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
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    parentClassName="flex gap-2 flex-col"
                    variant="lightgray"
                    className="mb-4"
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
