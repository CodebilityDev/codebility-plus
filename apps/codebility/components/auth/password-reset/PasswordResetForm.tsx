"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { resetUserPassword } from "@/actions/auth/password-reset/password-reset";
import { AuthAlert } from "@/components/global/auth/AuthAlert";
import { AuthEmailSent } from "@/components/global/auth/AuthEmailSent";
import { AuthField } from "@/components/global/auth/AuthField";
import { AuthSubmitButton } from "@/components/global/auth/AuthSubmitButton";
import type { Inputs } from "@/types/auth/password-reset/password-reset";
import { toErrorMessage } from "@/utils/global/feedback";
import { EmailValidation } from "@/utils/auth/password-reset/password-reset";

const PasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(EmailValidation),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: Inputs) => {
    setIsLoading(true);
    setFormError(null);

    try {
      await resetUserPassword(email);
      setSubmittedEmail(email.trim().toLowerCase());
    } catch (error) {
      setFormError(
        toErrorMessage(error, "We couldn't send the reset link. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail || isResending) return;

    setIsResending(true);

    try {
      await resetUserPassword(submittedEmail);
      toast.success("A new reset link is on its way.");
    } catch (error) {
      toast.error(toErrorMessage(error, "We couldn't resend the link."));
    } finally {
      setIsResending(false);
    }
  };

  if (submittedEmail) {
    return (
      <AuthEmailSent
        email={submittedEmail}
        onResend={handleResend}
        isResending={isResending}
      />
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-[40px] font-bold leading-[1.08] tracking-[-0.04em]">
        Reset your password
      </h1>
      <p className="mt-3 max-w-[420px] text-[15px] leading-6 text-white/65">
        Enter the email you signed up with and we&apos;ll send you a link to set
        a new password.
      </p>

      <form className="mt-8" noValidate onSubmit={handleSubmit(onSubmit)}>
        {formError ? <AuthAlert className="mb-5">{formError}</AuthAlert> : null}

        <AuthField
          id="email"
          label="Email"
          type="email"
          placeholder="you@email.com"
          autoComplete="email"
          disabled={isLoading}
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthSubmitButton
          type="submit"
          loading={isLoading}
          loadingText="Sending..."
          className="mt-7"
        >
          Send reset link
        </AuthSubmitButton>

        <div className="mt-6 text-center">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-white transition-colors hover:text-[#c084fc]"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetForm;
