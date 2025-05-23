import Image from "next/image";
import Link from "next/link";
import { LogoCodebilityWhite } from "@/public/assets/svgs/";

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
        <Image
          className="h-[23px] w-[100px] lg:h-[40px] lg:w-[150px]"
          src={LogoCodebilityWhite}
          alt="Codebility Logo"
          width={150}
          height={40}
          onClick={handleClick}
        />
      </Link>
    </>
  );
};

export default Logo;
