import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useUser from "@/app/home/_hooks/use-user";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/navigation";
import { useModal } from "@/hooks/use-modal";
import useChangeBgNavigation from "@/hooks/useChangeBgNavigation";
import useHideSidebarOnResize from "@/hooks/useHideSidebarOnResize";
import { MenuIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui/sheet";

const Navbar = () => {
  const { color } = useChangeBgNavigation();
  const { isSheetOpen, setIsSheetOpen } = useHideSidebarOnResize();
  const { onOpen } = useModal();
  const pathname = usePathname();
  const isAuthenticated = !useUser(); // if there is logged user

  return (
    <>
      <nav
        className={`fixed z-50 hidden w-full items-center justify-between  gap-5 p-5 lg:flex xl:px-12
      ${color ? "bg-black-100 border-b border-zinc-800" : "bg-transparent"}`}
      >
        <div className="hidden lg:block">
          <Logo />
        </div>
        <ul className="hidden gap-10 lg:flex">
          {navLinks.map((link, idx) => (
            <li key={idx}>
              {pathname === link.href ? (
                <Link href={link.href} className="text-lg text-primary">
                  {link.name}
                </Link>
              ) : link.name === "Contact Us" ? (
                <button
                  onClick={() => onOpen("contactUsModal")}
                  className="text-lg text-white transition duration-300 hover:text-blue-100"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="text-lg text-white transition duration-300 hover:text-blue-100"
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="font-inter font-regular hidden items-center gap-4 text-base lg:flex">
          <Link href={isAuthenticated ? "/dashboard" : "/auth/signin"}>
            <Button variant="link" className="text-white hover:text-blue-100">
              {isAuthenticated ? "Dashboard" : "Login"}
            </Button>
          </Link>

          <Link href="/auth/signup">
            <Button className="from-customTeal to-violet h-10 w-28 rounded-full bg-gradient-to-r via-blue-100 p-0.5 hover:bg-gradient-to-br xl:h-12 xl:w-36">
              <span className="bg-black-100 flex h-full w-full items-center justify-center rounded-full text-lg text-white lg:text-lg">
                Sign Up
              </span>
            </Button>
          </Link>
        </div>
      </nav>

      <div
        className={`${
          color ? "bg-black-100 border-b border-zinc-800" : "bg-transparent"
        } fixed z-50 flex w-full items-center justify-between py-6  ps-5 lg:hidden`}
      >
        <Link href="/" className="block h-[23px] w-[100px] lg:hidden">
          <Image
            src="/assets/svgs/codebility-white.svg"
            alt="Codebility Logo"
            width={100}
            height={23}
            className="h-auto w-auto"
            loading="eager"
            priority
          />
        </Link>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              className="bg-transparent"
              onClick={() => setIsSheetOpen(true)}
            >
              <MenuIcon className="text-gray-300" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-dark-100 border-r border-zinc-800 text-white">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetHeader className="flex flex-col items-start gap-6">
              <div className="border-darkgray w-full border-b pb-6">
                <Link
                  href="/"
                  className="mb-6 block h-[23px] w-[100px] lg:hidden"
                >
                  <Image
                    src="/assets/svgs/codebility-white.svg"
                    alt="Codebility Logo"
                    width={100}
                    height={23}
                    className="h-auto w-auto"
                    loading="eager"
                    priority
                  />
                </Link>
                <div className="flex flex-col gap-4 text-left">
                  {navLinks.map((link, id) => (
                    <div key={id}>
                      {pathname === link.href ? (
                        <Link href={link.href}>{link.name}</Link>
                      ) : link.name === "Contact Us" ? (
                        <button
                          onClick={() => onOpen("contactUsModal")}
                          className="text-lg text-white transition duration-300 hover:text-blue-100"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-lg transition duration-300 hover:text-blue-100"
                        >
                          {link.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="font-inter flex w-full flex-col gap-3 lg:flex">
                <Link href={isAuthenticated ? "/dashboard" : "/auth/signin"}>
                  <Button
                    variant="link"
                    className="w-full rounded-full bg-transparent text-lg text-white hover:text-blue-100"
                  >
                    {isAuthenticated ? "Dashboard" : "Login"}
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="from-customTeal to-violet w-full rounded-full bg-gradient-to-r via-blue-100 p-0.5 text-lg hover:bg-gradient-to-br xl:h-12 xl:w-36">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Navbar;
