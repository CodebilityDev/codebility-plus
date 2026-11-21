"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { resendVerificationEmail, signinUser } from "@/actions/global/auth-session";
import { AuthAlert } from "@/components/global/auth/AuthAlert";
import { AuthField } from "@/components/global/auth/AuthField";
import { AuthSubmitButton } from "@/components/global/auth/AuthSubmitButton";
import pathsConfig from "@/constants/global/paths";
import type { Inputs } from "@/types/auth/sign-in/sign-in";
import { SignInValidation } from "@/utils/auth/sign-in/auth-schema";
import { toErrorMessage } from "@/utils/global/feedback";

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SignInValidation),
  });

  const onSubmit = async (values: z.infer<typeof SignInValidation>) => {
    setIsLoading(true);
    setFormError(null);

    try {
      const normalizedEmail = values.email_address.toLowerCase();
      const response = await signinUser({
        email: normalizedEmail,
        password: values.password,
      });

      if (!response.success) {
        throw new Error(response.error);
      }

      if (response.redirectTo) {
        router.replace(response.redirectTo);
      }
    } catch (error) {
      const message = toErrorMessage(error, "");

      if (
        message.includes("verify your email") ||
        message.includes("Email not confirmed")
      ) {
        setFormError(
          "Please verify your email first. We've sent a new verification link.",
        );

        try {
          await resendVerificationEmail(values.email_address);
        } catch {
          setFormError("We couldn't resend the verification email. Please try again.");
        }

        router.push("/auth/verify");
      } else if (
        message.includes("Invalid login credentials") ||
        message.includes("Account not found")
      ) {
        setFormError(
          "Incorrect email or password. Check both and try again, or reset your password.",
        );
      } else {
        setFormError("We couldn't sign you in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-[40px] font-bold leading-[1.08] tracking-[-0.04em]">
        Sign in
      </h1>
      <p className="mt-3 max-w-[420px] text-[15px] leading-6 text-white/65">
        Welcome back. Sign in with your CoDev, mentor or admin account.
      </p>

      <form className="mt-8" noValidate onSubmit={handleSubmit(onSubmit)}>
        {formError ? <AuthAlert className="mb-5">{formError}</AuthAlert> : null}

        <div className="flex flex-col gap-5">
          <AuthField
            id="email_address"
            label="Email"
            type="email"
            placeholder="you@email.com"
            autoComplete="email"
            disabled={isLoading}
            error={errors.email_address?.message}
            {...register("email_address")}
          />

          <AuthField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isLoading}
            error={errors.password?.message}
            labelAction={
              <Link
                href={pathsConfig.auth.passwordReset}
                className="text-[13px] text-white/70 transition-colors hover:text-white"
              >
                Forgot password?
              </Link>
            }
            {...register("password")}
          />
        </div>

        <AuthSubmitButton
          type="submit"
          loading={isLoading}
          loadingText="Signing in..."
          className="mt-7"
        >
          Sign in
        </AuthSubmitButton>

        <p className="mt-5 text-center text-[14px] text-white/60">
          New to Codebility?{" "}
          <Link
            href={pathsConfig.auth.signUp}
            className="font-medium text-white transition-colors hover:text-[#c084fc]"
          >
            Join as a CoDev
          </Link>
        </p>
      </form>

      <div className="mt-8 border-t border-white/10" />

      <div className="mt-6 flex flex-col gap-3 text-[14px] text-white/60 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[290px] leading-5">
          Looking to hire developers? You don&apos;t need an account.
        </p>
        <Link
          href="/bookacall"
          className="flex w-fit items-center gap-2 font-medium text-white transition-colors hover:text-[#c084fc]"
        >
          Book a call
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
