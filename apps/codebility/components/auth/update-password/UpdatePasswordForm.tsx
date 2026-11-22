"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, CircleAlert, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/global/design-system/Button";
import { AuthAlert } from "@/components/global/auth/AuthAlert";
import { AuthField } from "@/components/global/auth/AuthField";
import { AuthStatusPanel } from "@/components/global/auth/AuthStatusPanel";
import { AuthSubmitButton } from "@/components/global/auth/AuthSubmitButton";
import { getClientSupabase } from "@/lib/global/supabase-client";

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
type SessionState = "checking" | "ready" | "invalid" | "success";

const primaryButtonClass =
  "h-[56px] w-full rounded-full bg-[#9747ff] text-[16px] font-medium shadow-[0_0_34px_rgba(151,71,255,0.26)] hover:bg-[#a855f7]";

export default function UpdatePasswordForm() {
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [formError, setFormError] = useState<string | null>(null);
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
    setFormError(null);

    try {
      const supabase = getClientSupabase();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setFormError(error.message);
        return;
      }

      await supabase.auth.signOut();
      setSessionState("success");
      form.reset();
    } catch {
      setFormError("An unexpected error occurred. Please try again.");
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
      <AuthStatusPanel
        icon={CircleAlert}
        tone="danger"
        title="This link has expired"
        description="Reset links work once and only for a limited time. Request a new one and use the latest email."
      >
        <Button asChild className={primaryButtonClass}>
          <Link href="/auth/password-reset">Send a new link</Link>
        </Button>
        <div className="mt-5 text-center">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-white transition-colors hover:text-[#c084fc]"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </AuthStatusPanel>
    );
  }

  if (sessionState === "success") {
    return (
      <AuthStatusPanel
        icon={Check}
        tone="success"
        title="Password updated"
        description="Your password has been changed. Sign in with your new password."
      >
        <Button asChild className={primaryButtonClass}>
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
      </AuthStatusPanel>
    );
  }

  const password = form.watch("password");
  const passwordIsValid = password.length >= 8;

  return (
    <div className="w-full">
      <span className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#9747ff]/25 bg-[#1c102c] text-[#c084fc]">
        <Lock aria-hidden className="h-6 w-6" />
      </span>

      <h1 className="mt-9 text-[40px] font-bold leading-[1.08] tracking-[-0.04em]">
        Set a new password
      </h1>
      <p className="mt-4 max-w-[420px] text-[15px] leading-6 text-white/65">
        Choose a new password for your Codebility account.
      </p>

      <form className="mt-8" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        {formError ? <AuthAlert className="mb-5">{formError}</AuthAlert> : null}

        <AuthField
          label="New password"
          type="password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          inputClassName="h-12"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />

        <p className="mt-2 flex items-center gap-2 text-[13px] leading-5 text-[#A0A0A0]">
          <Check
            aria-hidden
            className={
              passwordIsValid ? "h-4 w-4 text-[#4BCE97]" : "h-4 w-4 text-white/30"
            }
          />
          At least 8 characters
        </p>

        <div className="mt-5">
          <AuthField
            label="Confirm new password"
            type="password"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            inputClassName="h-12"
            error={form.formState.errors.confirmPassword?.message}
            {...form.register("confirmPassword")}
          />
        </div>

        <AuthSubmitButton
          type="submit"
          loading={form.formState.isSubmitting}
          loadingText="Updating..."
          className="mt-7"
        >
          Update password
        </AuthSubmitButton>
      </form>
    </div>
  );
}
