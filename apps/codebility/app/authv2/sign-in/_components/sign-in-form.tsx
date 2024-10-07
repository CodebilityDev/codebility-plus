"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import pathsConfig from "@/config/paths.config";
import { SignInValidation } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { signinUser } from "../../actions";
import SignInInputs from "./sign-in-input";

type Inputs = z.infer<typeof SignInValidation>;

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      await signinUser(values.email_address, values.password);
      toast.success("Logged in successfully!");
      setIsLoading(false);
    } catch (e) {
      toast.error((e as { message: string }).message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 py-3">
          <SignInInputs
            id="email_address"
            label="Email"
            placeholder="Enter your Email"
            register={register}
            errors={errors}
            disabled={isLoading}
            type="email"
          />
          <SignInInputs
            id="password"
            label="Password"
            placeholder="Enter your Password"
            register={register}
            errors={errors}
            disabled={isLoading}
            type="password"
          />
          <button
            type="button"
            onClick={() => router.push(pathsConfig.auth.passwordReset)}
            className="text-md text-right duration-300 hover:text-blue-100"
          >
            Forgot Password?
          </button>
          <Button
            type="submit"
            variant="default"
            className="text-md w-full py-3 font-normal"
            disabled={isLoading}
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
