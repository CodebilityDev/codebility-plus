"use client";

import { useState } from "react";
import Link from "next/link";
import InputField from "@/components/global/layout/InputPhone";
import { Button } from "@/components/global/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import type { FieldValues, SubmitHandler, Control } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


import { resetUserPassword } from "@/actions/auth/password-reset/password-reset";
import type { Inputs } from "@/types/auth/password-reset/password-reset";
import { EmailValidation } from "@/utils/auth/password-reset/password-reset";


const PasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
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

      // call resetUserPassword function
      await resetUserPassword(email as string);

      toast.success("Password reset email sent successfully.");
      setIsSubmitted(true);
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
              control={control as Control<any>}
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
