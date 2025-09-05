import Image from "next/image";
import Link from "next/link";

import PasswordResetForm from "./_components/PasswordResetForm";

const PasswordReset = () => {
  return (
    <div className="bg-dark-300 flex min-h-screen flex-col items-center justify-center text-white lg:flex-row">
      <div className="bg-dark-100 flex h-full w-full flex-col justify-between gap-2 rounded-sm px-4 py-10 md:h-[475px] md:w-[497px] md:p-10">
        <Link href="/" className="mx-auto">
          <Image
            src="/assets/svgs/codebility-white.svg"
            width={222}
            height={44}
            alt="Codebility Logo"
          />
        </Link>

        <PasswordResetForm />

        <p className="mx-auto text-sm text-white">
          Have an account?{" "}
          <Link href="/auth/sign-in" className="text-customBlue-100 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PasswordReset;
