"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AlertCircle, HelpCircleIcon, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@codevs/ui/alert";
import { Button } from "@codevs/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@codevs/ui/card";
import {
  Dialog,
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
import { Popover, PopoverContent, PopoverTrigger } from "@codevs/ui/popover";

const userDeletionSchema = z.object({
  confirmation: z.string().refine((val) => val === "DELETE", {
    message: "Please type DELETE to confirm",
  }),
});

type DeleteConfirmation = "DELETE";
type EmptyString = "";
type FormConfirmation = DeleteConfirmation | EmptyString;

interface UserDeletionFormValues {
  confirmation: FormConfirmation;
}

export default function AccountSettingsDelete() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useForm<UserDeletionFormValues>({
    resolver: zodResolver(userDeletionSchema),
    mode: "onChange",
    defaultValues: {
      confirmation: "" as EmptyString,
    },
  });

  const onSubmit = async (values: UserDeletionFormValues) => {
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

      // Delete user data from your codev table first
      const { error: dbError } = await supabase
        .from("codev")
        .delete()
        .eq("id", user.id);

      if (dbError) {
        toast.error("Failed to delete user data");
        return;
      }

      // Delete the authentication user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id,
      );

      if (authError) {
        toast.error("Failed to delete account");
        return;
      }

      // Sign out the user
      await supabase.auth.signOut();

      toast.success("Account deleted successfully");
      router.push("/"); // Redirect to home page
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete account error:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <>
      <AccountSettingsBackdrop isOpen={isOpen} />
      <Card className="background-box text-dark100_light900 w-full border border-red-600">
        <CardHeader>
          <CardTitle className="flex items-center text-base text-red-600 sm:text-2xl">
          <div className="flex w-full items-center justify-between">
              <h1 className="flex items-center">
                <Trash2 className="mr-2" /> Delete Account
              </h1>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircleIcon className="h-4 w-4" />
                    <span className="sr-only">Help</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium">About account deletion</h4>
                    <p className="text-sm text-muted-foreground">
                      When you delete your account, all your data is permanently
                      removed from our systems. This includes your profile,
                      content, and activity history.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If you&apos;re having issues with our service, consider
                      contacting support before deletion.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
         {/*  <Alert className="background-box mb-4 border border-red-600 text-red-600">
            <AlertCircle className="h-4 w-4" color="red" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription className="text-xs sm:text-sm">
              This action is irreversible. All your data will be permanently
              deleted.
            </AlertDescription>
          </Alert> */}
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
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent className="text-dark100_light900 background-box w-[90%] sm:w-full">
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                  <FormField
                    control={form.control}
                    name="confirmation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Type DELETE to confirm"
                            labelClassName="sm:text-base text-sm"
                            label="To confirm, type DELETE in the box below:"
                            parentClassName="flex flex-col gap-2"
                            variant="lightgray"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="mt-4 gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" disabled={isLoading}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      type="submit"
                      disabled={!form.formState.isValid || isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete Account"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
