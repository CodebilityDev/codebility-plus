"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@codevs/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@codevs/ui/form";
import { Input } from "@codevs/ui/input";

import AccountSettingsBackdrop from "./AccountSettingsBackDrop";
import { createClientClientComponent } from "@/utils/supabase/client";

const emailChangeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function AccountSettingsDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
   const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);


  const form = useForm<z.infer<typeof emailChangeSchema>>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof emailChangeSchema>) => {
    try {
      setIsLoading(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("User not found");
        return;
      }

      // Update email in auth
      const { error: authError } = await supabase.auth.updateUser({
        email: values.email,
      });

      if (authError) {
        toast.error(authError.message);
        return;
      }

      // Update email in codev table
      const { error: dbError } = await supabase
        .from("codev")
        .update({ email_address: values.email })
        .eq("id", user.id);

      if (dbError) {
        toast.error("Failed to update email in database");
        return;
      }

      toast.success("Verification email sent. Please check your inbox.");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Email change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AccountSettingsBackdrop isOpen={isOpen} />
      
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              form.reset();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="h-11 bg-blue-200 text-white duration-300 hover:bg-blue-300">
              Change email
            </Button>
          </DialogTrigger>
          <DialogContent className="text-dark100_light900 background-box w-[90%] sm:w-full">
            <DialogHeader>
              <DialogTitle>Change Email Address</DialogTitle>
              <DialogDescription>
                Enter your new email address below. You&apos;ll need to verify
                this email before the change takes effect.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4 py-4"
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        variant="lightgray"
                        label="New Email Address"
                        parentClassName="flex flex-col gap-2"
                        {...field}
                        placeholder="Enter new email address"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="text-dark100_light900 bg-blue-200 duration-300 hover:bg-blue-300"
                  disabled={!form.formState.isValid || isLoading}
                >
                  {isLoading ? "Updating..." : "Change Email"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      
    </>
  );
}
