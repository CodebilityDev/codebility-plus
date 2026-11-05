"use client";

import Image from "next/image";
import Link from "next/link";
import { useTripleClickSignIn } from "@/hooks/global/useTripleClickSignIn";

const Logo = () => {
  const handleClick = useTripleClickSignIn();

  return (
    <Link href="/">
      <Image
        src="/assets/svgs/codebility-white.svg"
        alt="Codebility Logo"
        width={100}
        height={23}
        className="h-[23px] w-[100px] lg:h-[40px] lg:w-[150px]"
        loading="eager"
        priority
        onClick={handleClick}
      />
    </Link>
  );
};

export default Logo;
