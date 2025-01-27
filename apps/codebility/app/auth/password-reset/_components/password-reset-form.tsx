"use client";

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

const PasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supabase = createClientComponentClient(); // Initialize Supabase client

  const {
    control, // React Hook Form control
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(EmailValidation),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const { email } = data;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`,
      });

      if (error) {
        console.error("Error resetting password:", error);
        toast.error("Failed to send reset email. Please try again.");
      } else {
        toast.success("Password reset email sent successfully.");
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      reset();
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
            {/* Use InputField for email input */}
            <InputField
              id="email"
              label="Email"
              type="email"
              control={control} // Use control from React Hook Form
              error={errors.email?.message}
              disabled={isLoading}
              inputClassName="bg-gray-50 border-gray-300"
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
