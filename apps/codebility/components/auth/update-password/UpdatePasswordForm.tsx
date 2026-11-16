"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
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

import { getClientSupabase } from "@/lib/global/supabase-client";

const updatePasswordSchema = z
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

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
type SessionState = "checking" | "ready" | "invalid" | "success";

export default function UpdatePasswordForm() {
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const supabase = getClientSupabase();
        const { error } = await supabase.auth.getUser();

        if (active) setSessionState(error ? "invalid" : "ready");
      } catch {
        if (active) setSessionState("invalid");
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async ({ password }: UpdatePasswordValues) => {
    try {
      const supabase = getClientSupabase();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
        return;
      }

      await supabase.auth.signOut();
      setSessionState("success");
      form.reset();
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (sessionState === "checking") {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-transparent" />
        <p className="text-sm text-white/70">Checking your reset link...</p>
      </div>
    );
  }

  if (sessionState === "invalid") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <h1 className="text-xl font-semibold">Reset link unavailable</h1>
        <p className="max-w-sm text-sm text-white/70">
          This password reset link is invalid or has expired. Request a new
          link to continue.
        </p>
        <Button asChild className="text-sm">
          <Link href="/auth/password-reset">Request a new link</Link>
        </Button>
      </div>
    );
  }

  if (sessionState === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <h1 className="text-xl font-semibold">Password updated</h1>
        <p className="max-w-sm text-sm text-white/70">
          Your password has been changed. Sign in with your new password to
          continue.
        </p>
        <Button asChild className="text-sm">
          <Link href="/auth/sign-in">Go to sign in</Link>
        </Button>
      </div>
    );
  }

  const isButtonDisabled =
    form.formState.isSubmitting ||
    !form.formState.isValid ||
    !form.formState.isDirty;

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="text-lg font-semibold lg:text-xl">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Choose a new password for your account.
        </p>
      </div>

      <Form {...form}>
        <form
          className="space-y-3"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    label="New Password"
                    autoComplete="new-password"
                    parentClassName="flex gap-1 flex-col text-lg"
                    variant="lightgray"
                    className="text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
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
                    autoComplete="new-password"
                    parentClassName="flex gap-1 flex-col text-lg"
                    variant="lightgray"
                    className="text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full py-3 text-sm"
            disabled={isButtonDisabled}
          >
            {form.formState.isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
