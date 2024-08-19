import Link from "next/link"
import AuthForm from "./SigninForm"
import Logo from "@/Components/shared/Logo"
import { Toaster } from "@/Components/ui/toaster"
import pathsConfig from "@/config/paths.config"

const SignUpPage = () => {
    return (
      <>
        <Toaster />
        <div className="flex min-h-screen w-full bg-dark-300">
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <div className="flex h-[600px] w-full flex-col justify-between gap-6 p-10 text-white md:w-[500px]">
              <div className="flex justify-center">
                <Logo />
              </div>
              <div className="text-md text-center">
                <p className="text-2xl">Log in to your account</p>
                <p className="text-gray">Welcome back! Please enter your details.</p>
              </div>
              <AuthForm />
              <p className="md:text-md text-md text-center">
                Don{`'`}t have an account?{" "}
                <Link href={pathsConfig.auth.signUp} className="hover:blue-200 text-blue-100">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
          <div className="hidden w-full flex-1 bg-login bg-cover bg-center lg:flex" />
        </div>
      </>
    )
}

export default SignUpPage
