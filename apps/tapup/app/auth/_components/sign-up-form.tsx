"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@codevs/ui/button";
import { Checkbox } from "@codevs/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@codevs/ui/form";
import { Input } from "@codevs/ui/input";
import { toast, Toaster } from "@codevs/ui/sonner-toast";

import appConfig from "~/config/app.config";
import pathsConfig from "~/config/paths.config";
import { formAttributes, formSchema } from "../_lib/sign-up-form-schema";
import { signInWithOAuth, signUp } from "../actions";

function SignUpForm() {
  const [toggle, setToggle] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      privacyPolicy: true,
    },
  });

  const { reset } = form;

  const handleToggle = (e: FormEvent) => {
    e.preventDefault();
    setToggle((c) => !c);
  };

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.confirmPassword) {
      return;
    }

    const name = values.name;
    const email = values.email;
    const password = values.password;

    try {
      await signUp(email, password, name);
      reset();
      toast.success("Success! Continue by verifying your email!");
    } catch (e) {
      toast.error((e as { message: string }).message);
    }
  };
  return (
    <div className="flex w-full justify-center">
      <Toaster richColors position="top-right" />
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleSignUp)}
          className="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-card p-8 shadow-2xl"
        >
          <div className="flex flex-col gap-y-3">
            <h2 className="-mb-2 text-center font-bold text-foreground md:text-start md:text-2xl">
              Create a {appConfig.name} account
            </h2>
            <div className="flex gap-x-2">
              <p className="text-sm text-foreground/60">
                Already have an acount?
              </p>
              <Link
                href={pathsConfig.auth.signIn}
                className="text-sm text-primary"
              >
                Login
              </Link>
            </div>
            <div className="flex gap-x-2">
              <Button
                onClick={() => signInWithOAuth("google")}
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-400 bg-white py-3 text-foreground hover:bg-gray-50 hover:text-foreground"
              >
                <div className="relative aspect-square w-5">
                  <Image src="/devicon_google.svg" alt="google" fill />
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => signInWithOAuth("facebook")}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-700 py-3 text-foreground hover:bg-blue-500 hover:text-foreground  "
              >
                <div className="relative aspect-square w-5">
                  <Image src="/facebook.svg" alt="facebook" fill />
                </div>
              </Button>
              <Button
                type="button"
                onClick={() => signInWithOAuth("linkedin_oidc")}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-400 bg-white py-3 text-foreground hover:bg-gray-50 hover:text-foreground "
              >
                <div className="relative aspect-square w-5">
                  <Image src="/linkedin.svg" alt="linkedin" fill />
                </div>
              </Button>
            </div>
          </div>

          {/* DIVIDER */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-foreground"></div>
            <span className="mx-4 text-foreground/60">or</span>
            <div className="flex-grow border-t border-foreground"></div>
          </div>
          {/* DIVIDER */}

          {formAttributes.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md text-foreground">
                    {field.label}
                  </FormLabel>
                  <FormControl>
                    {field.isPassword ? (
                      <div className="flex w-full items-center rounded-xl border-2 pr-4">
                        <Input
                          parentClassName="py-0 w-full"
                          className="border-none text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...formField}
                          type={toggle ? "text" : "password"}
                          placeholder={toggle ? "password" : "*********"}
                        />
                        <div
                          onClick={handleToggle}
                          className="flex cursor-pointer items-center p-0 hover:bg-transparent"
                        >
                          {toggle ? (
                            <Eye className="text-foreground/60" />
                          ) : (
                            <EyeOff className="text-foreground/60" />
                          )}
                        </div>
                      </div>
                    ) : (
                      <Input
                        parentClassName="py-0 w-full"
                        className="border-2 text-xs text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...formField}
                        type={field.type}
                        placeholder={field.placeholder}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            className="mt-6 w-full font-semibold"
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
              "Create Account"
            )}
          </Button>

          <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormLabel>
                    <p className="text-xs text-foreground">
                      By agreeing, you agree {appConfig.name}{" "}
                      <Link className="text-xs text-primary" href="">
                        Terms and Services
                      </Link>{" "}
                      and{" "}
                      <Link className="text-xs text-primary" href="">
                        Privacy Policy
                      </Link>
                    </p>
                  </FormLabel>
                </div>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default SignUpForm;
