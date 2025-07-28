import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Toaster } from "@/components/ui/toaster";
import pathsConfig from "@/config/paths.config";

import AuthForm from "./_components/SignInForm";

const SignIn = () => {
  return (
    <>
      <Toaster />
      <div className="bg-dark-300 flex min-h-screen w-full text-white">
        <div className="flex flex-1 flex-col justify-center px-4 py-8">
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
              href={pathsConfig.auth.onboarding}
              className="text-blue-100 hover:underline"
            >
              Register Now
            </Link>
          </p>
        </div>
        <div className="bg-login hidden w-full flex-1 bg-cover bg-center lg:flex" />
      </div>
    </>
  );
};

export default SignIn;
