import Image from "next/image";
import Link from "next/link";

import SignUpForm from "./_components/SignUpForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SignUpPage = () => {
  return (
    <div className="bg-black-500 flex min-h-screen items-center justify-center text-white md:px-4">
      <div className="flex w-full max-w-[60rem] flex-col justify-center gap-2 bg-[#1E1F26] py-8 md:rounded-2xl xl:p-8">
        <Link href="/" className="mx-auto mb-6">
          <Image
            className="h-[45px] w-[200px] cursor-pointer"
            src="/assets/svgs/codebility-white.svg"
            width={200}
            height={45}
            style={{ width: "auto", height: "auto" }}
            alt="Codebility Logo"
          />
        </Link>
        <p className="text-center text-xl font-semibold">Create new account</p>
        <p className="text-md text-center">
          To use Codebility, please enter your details
        </p>
        <p className="text-md text-black-300 text-center font-light">
          All fields not labeled {"optional"} are required.
        </p>
        <SignUpForm />
        <p className="text-gray mx-auto text-sm">
          Have an account?{" "}
          <Link href="/auth/sign-in" className="text-blue-100 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
