"use client";

import { useState } from "react";
import Link from "next/link";
import InputEmail from "@/app/auth/InputEmail";
import { Button } from "@/Components/ui/button";
import { EmailValidation } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Inputs = z.infer<typeof EmailValidation>;

const PasswordResetForm = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(EmailValidation),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setisLoading(true);

    try {
      toast.success("This feature is currently not available");
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setisLoading(false);
      setIsSubmitted(false);
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
            <InputEmail
              id="email"
              label="Email"
              register={register}
              errors={errors}
              disabled={isLoading}
              type="email"
            />
            <Button
              type="submit"
              variant="default"
              className="w-max self-end py-3 text-sm"
              disabled={isLoading}
            >
              Send Request
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PasswordResetForm;
