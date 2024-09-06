"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@codevs/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@codevs/ui/form";
import { toast, Toaster } from "@codevs/ui/sonner-toast";

import pathsConfig from "~/config/paths.config";
import { signInWithOAuth, signInWithPassword } from "../actions";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (values: z.infer<typeof formSchema>) => {
    const { email, password } = values;

    try {
      await signInWithPassword(email, password);
    } catch (e) {
      toast.error((e as { message: string }).message);
    }
  };

  return (
    <div className="flex w-8/12">
      <div className="flex-1 rounded-l-xl bg-card shadow-xl">
        <div className="flex flex-col items-center gap-3 px-10 py-16">
          <Toaster richColors position="top-right" />
          <Form {...form}>
            <Image
              src="/logo-tapup-dark.svg"
              width={150}
              height={150}
              alt="tapup-brand"
            />
            <div className="flex flex-col items-center gap-1">
              <div className="-mb-1 text-3xl font-bold">
                Create your free account
              </div>
              <div className="flex w-96 flex-col gap-1 text-sm">
                <div className="text-center">
                  Create your free account to search or filter through multiple
                  cards. No credit card required.
                </div>
                <div className="flex gap-x-2">
                  <Button
                    onClick={() => signInWithOAuth("google")}
                    type="button"
                    className="text-custom-black hover:text-custom-black flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-400 bg-white py-3 hover:bg-gray-50"
                  >
                    <div className="relative aspect-square w-5">
                      <Image src="/devicon_google.svg" alt="google" fill />
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => signInWithOAuth("facebook")}
                    className="text-custom-black hover:text-custom-black flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-700 py-3 hover:bg-blue-500  "
                  >
                    <div className="relative aspect-square w-5">
                      <Image src="/facebook.svg" alt="facebook" fill />
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => signInWithOAuth("linkedin_oidc")}
                    className="text-custom-black hover:text-custom-black flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-400 bg-white py-3 hover:bg-gray-50 "
                  >
                    <div className="relative aspect-square w-5">
                      <Image src="/linkedin.svg" alt="linkedin" fill />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center">
              <div className="flex-grow border-t border-foreground"></div>
              <span className="mx-4 text-foreground/60">or</span>
              <div className="flex-grow border-t border-foreground"></div>
            </div>
            <form onSubmit={form.handleSubmit(handleSignIn)} className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <input
                          type="email"
                          id="email"
                          className=" peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-border px-2.5 pb-2.5 pt-5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-background dark:focus:border-primary"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="email"
                        className="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-primary duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary dark:text-primary rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                      >
                        Enter your Email
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <input
                          type="password"
                          id="password"
                          className="peer block w-full appearance-none rounded-t-lg border-0 border-b-2 border-border px-2.5 pb-2.5 pt-5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-background dark:focus:border-primary"
                          placeholder=" "
                          {...field}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="password"
                        className="absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-primary duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary dark:text-primary rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
                      >
                        Password
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                onClick={() => router.push(pathsConfig.auth.passwordReset)}
                className="mt-1 flex cursor-pointer justify-end text-sm text-primary hover:text-foreground"
              >
                Forgot Password?
              </div>
              <div className="mt-1 flex flex-col gap-2">
                <div className="space-x-2 text-center">
                  <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    By proceeding, you agreed to the&nbsp;
                    <span className="cursor-pointer font-semibold underline  hover:text-primary">
                      Terms of services
                    </span>
                    &nbsp;and&nbsp;
                    <span className="cursor-pointer font-semibold underline hover:text-primary">
                      Privacy policy
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="mr-3 h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </Button>

                <div className="space-x-2 text-center">
                  <p>
                    Don’t have an account?&nbsp;
                    <span
                      onClick={() => router.push(pathsConfig.auth.signUp)}
                      className="cursor-pointer font-semibold hover:text-primary"
                    >
                      Sign-up here
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div className="relative flex-1">
        <Image
          fill
          src="/login-side-bg.png"
          className="absolute inset-0 h-full w-full rounded-r-xl bg-green-500 object-cover"
          alt="Background Image"
        />
      </div>
    </div>
  );
}

export default SignInForm;
