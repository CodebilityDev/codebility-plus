import Link from "next/link";
import { LogoCodebilityWhite } from "@/public/assets/svgs";

const Logo = () => {
  return (
    <>
      <Link href="/">
        <LogoCodebilityWhite className="h-[23px] w-[100px] lg:h-[40px] lg:w-[150px]" />
      </Link>
    </>
  );
};

export default Logo;
