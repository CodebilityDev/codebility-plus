import Image from "next/image"
import SignUpForm from "./SignUpForm"
import Link from "next/link"
import pathsConfig from "@/config/paths.config"

const SignUp = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black-500 px-3.5 text-white lg:flex-row">
      <div className="flex w-full max-w-[60rem] flex-col justify-center gap-2 rounded-2xl bg-[#1E1F26] p-8">
        <Link href="/" className="mx-auto mb-6">
          <Image
            className="h-[45px] w-[200px] cursor-pointer"
            src="/assets/svgs/codebility-white.svg"
            width={200}
            height={45}
            alt="Codebility Logo"
          />
        </Link>
        <p className=" text-center text-xl font-semibold">Create new account</p>
        <p className="text-md text-center">To use Codebility, please enter your details</p>
        <p className="text-md text-center font-light text-black-300">
          All fields not labeled {"optional"} are required.
        </p>
        <SignUpForm />
        <p className="mx-auto text-sm text-gray">
          Have an account?{" "}
          <Link href={pathsConfig.auth.signIn} className="text-blue-100 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
