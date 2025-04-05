"use client";

import { get } from "http";
import { useState } from "react";
import Link from "next/link";
import InputField from "@/Components/shared/dashboard/InputPhone";
import { Button } from "@/Components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

// Define the schema for email validation
const EmailValidation = z.object({
  email: z.string().email("Invalid email address"),
});

type Inputs = z.infer<typeof EmailValidation>;

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

const PasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supabase = createClientComponentClient(); // Initialize Supabase client

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(EmailValidation),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const { email } = data;

      // Basic reset without custom redirect
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getURL}home/settings/account-settings`,
      });

      if (error) {
        console.error("Error resetting password:", error);
        toast.error(error.message || "Failed to send reset email");
      } else {
        toast.success("Password reset email sent successfully.");
        setIsSubmitted(true);
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-lg font-semibold lg:text-xl">
        Forgot Password
      </p>

      {isSubmitted ? (
        <div className="mx-auto flex w-full flex-col items-center gap-8 py-10">
          <h1 className="max-w-[266px] text-center text-xl font-light">
            Please check your email inbox to reset your password.
          </h1>
          <Link href="/">
            <Button className="text-sm font-light">Go to Homepage</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8 py-10">
            <InputField
              id="email"
              label="Email"
              type="email"
              control={control}
              error={errors.email?.message}
              disabled={isLoading}
              inputClassName="bg-gray-50 border-gray-300"
              name="email"
            />
            <Button
              type="submit"
              variant="default"
              className="w-max self-end py-3 text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordResetForm;
