"use client";

import { useState } from "react";
import { accountSettingsEmailSchema } from "@/schema/account-settings-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import AccountSettingsBackdrop from "./account-settings-backdrop";

export default function AccountSettingsDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof accountSettingsEmailSchema>>({
    resolver: zodResolver(accountSettingsEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof accountSettingsEmailSchema>,
  ) => {
    console.log(values);
    form.reset();
    setIsOpen(false);
  };
  return (
    <>
      <AccountSettingsBackdrop isOpen={isOpen} />
      <Form {...form}>
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
          <DialogContent className="text-dark100_light900 background-box">
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
                        variant={"lightgray"}
                        label="New Email Address"
                        parentClassName="flex flex-col gap-2"
                        {...field}
                        placeholder="Enter new email address"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="text-dark100_light900 bg-blue-200 duration-300 hover:bg-blue-300"
                  disabled={!form.formState.isValid}
                >
                  Change Email
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
