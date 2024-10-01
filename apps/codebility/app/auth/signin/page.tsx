"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/auth/signin/SigninForm";
import Loader from "@/Components/shared/Loader";
import Logo from "@/Components/shared/Logo";
import useAuthCookie from "@/hooks/use-cookie";

import { Toaster } from "@codevs/ui/sonner";

const Sign = () => {
  const router = useRouter();
  const authCredentials = useAuthCookie();

  useEffect(() => {
    if (authCredentials?.status === "authenticated") {
      router.push("/dashboard");
    }
  }, [authCredentials?.status, router]);

  if (
    authCredentials?.status === "loading" ||
    authCredentials?.status === "authenticated"
  )
    return (
      <Loader className="bg-black-400 fixed left-0 top-0 z-20 flex h-screen w-screen flex-col items-center justify-center gap-10" />
    );

  if (authCredentials?.status === "unauthenticated")
    return (
      <>
        <Toaster />
        <div className="bg-dark-300 flex min-h-screen w-full">
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <div className="flex h-[600px] w-full flex-col justify-between gap-6 p-10 text-white md:w-[500px]">
              <div className="flex justify-center">
                <Logo />
              </div>
              <div className="text-md text-center">
                <p className="text-2xl">Log in to your account</p>
                <p className="text-gray">
                  Welcome back! Please enter your details.
                </p>
              </div>
              <AuthForm />
              <p className="md:text-md text-md text-center">
                Don{`'`}t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="hover:blue-200 text-blue-100"
                >
                  Register Now
                </Link>
              </p>
            </div>
          </div>
          <div className="bg-login hidden w-full flex-1 bg-cover bg-center lg:flex" />
        </div>
      </>
    );
};

export default Sign;
