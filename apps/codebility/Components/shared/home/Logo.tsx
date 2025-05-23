import Image from "next/image";
import Link from "next/link";
import { LogoCodebilityWhite } from "@/public/assets/svgs";

let clickCount = 0;
let timer: NodeJS.Timeout;

const handleClick = (event: React.MouseEvent) => {
  clickCount++;

  if (clickCount === 3) {
    clickCount = 0;
    window.location.href = "/auth/sign-in";
    return;
  }
  // Reset count of mouse click
  clearTimeout(timer);
  timer = setTimeout(() => (clickCount = 0), 1000);
};

const Logo = () => {
  return (
    <>
      <Link href="/">
        {/* <LogoCodebilityWhite
          onClick={handleClick}
          className="h-[23px] w-[100px] lg:h-[40px] lg:w-[150px]"
        /> */}
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
    </>
  );
};

export default Logo;
