import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import UpdatePasswordForm from "@/components/auth/update-password/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Codebility",
  description: "Set a new password for your Codebility account.",
};

const UpdatePasswordPage = () => {
  return (
    <div className="bg-dark-300 flex min-h-screen flex-col items-center justify-center text-white lg:flex-row">
      <div className="bg-dark-100 flex min-h-[475px] w-full flex-col justify-between gap-2 rounded-sm px-4 py-10 md:w-[497px] md:p-10">
        <Link href="/" className="mx-auto">
          <Image
            src="/assets/svgs/codebility-white.svg"
            width={222}
            height={44}
            alt="Codebility Logo"
          />
        </Link>

        <UpdatePasswordForm />

        <p className="mx-auto text-sm text-white">
          Back to{" "}
          <Link
            href="/auth/sign-in"
            className="text-customBlue-100 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
