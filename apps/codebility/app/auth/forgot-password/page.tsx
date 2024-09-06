import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "@/app/auth/forgot-password/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="bg-dark-300 flex min-h-screen flex-col items-center justify-center px-3.5 text-white lg:flex-row">
      <div className="bg-dark-100 flex h-full w-full flex-col justify-between gap-2 rounded-sm p-10 md:h-[475px] md:w-[497px]">
        <Link href="/" className="mx-auto">
          <Image
            src="/assets/svgs/codebility-white.svg"
            width={222}
            height={44}
            alt="Codebility Logo"
          />
        </Link>

        <ForgotPasswordForm />

        <p className="mx-auto text-sm text-white">
          Have an account?{" "}
          <Link href="/auth/signin" className="text-blue-100 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
