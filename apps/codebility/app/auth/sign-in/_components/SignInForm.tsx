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

import { resendVerificationEmail, signinUser } from "../../actions";
import SignInInputs from "./SignInInput";

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
      // Normalize email (if your signup stored lowercase emails)
      const normalizedEmail = values.email_address.toLowerCase();
      const response = await signinUser(normalizedEmail, values.password);

      // If the response indicates failure, log and show the error toast
      if (!response.success) {
        /* console.error("Sign in failed:", response.error); */
   /*      toast.error(response.error || "Invalid email or password");
 */
        throw new Error(response.error);
        /* // Delay a bit to let the toast show before returning
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return; // Exit early so no redirect is attempted */
      }

      // Otherwise, handle redirection based on the redirectTo value
      if (response.redirectTo) {
        switch (response.redirectTo) {
          case "auth/waiting":
            toast("Your application is still under review");
            break;
          case "/auth/declined":
            toast("Your application has been rejected");
            break;
          case "/home":
            toast.success("Welcome back!");
            break;
        }
        // Delay navigation slightly so the toast can be seen
        setTimeout(() => {
          router.replace(response.redirectTo);
        }, 500);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);

      if (
        error.message?.includes("verify your email") ||
        error.message?.includes("Email not confirmed")
      ) {
        toast.error("Please verify your email first");

        // call supabase function to send verification email
        try {
          const resendResult = await resendVerificationEmail(
            values.email_address,
          );
          if (resendResult.success) {
            toast.success("Verification email sent! Please check your inbox.");
          } else {
            toast.error(
              resendResult.error || "Failed to resend verification email",
            );
          }
        } catch (resendError) {
          console.error("Error resending verification email:", resendError);
          toast.error("Failed to resend verification email");
        }

        router.push("/auth/verify");
      } else if (
        error.message?.includes("Invalid login credentials") ||
        error.message?.includes("Account not found")
      ) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Failed to sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-2">
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
            className="text-md w-max self-end text-right duration-300 hover:text-blue-100"
          >
            Forgot Password?
          </button>
          <Button
            type="submit"
            variant="default"
            className="text-md w-full py-3 font-normal"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
