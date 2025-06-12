import Link from "next/link";
import Logo from "@/Components/shared/Logo";
import { aboutLinks, siteLinks } from "@/constants/links";
import { useModal } from "@/hooks/use-modal";

const Footer = () => {
  const { onOpen } = useModal();
  return (
    <footer className="bg-black-400 text-gray">
      <div className="flex flex-col gap-4 px-6 py-24 md:px-10 lg:flex-row lg:px-32">
        <div className="flex basis-[40%] justify-center lg:justify-start">
          <Logo />
        </div>

        <div className="flex basis-[20%] flex-col items-center gap-4 lg:items-start">
          <p className="mt-4 text-xl font-semibold text-white">About Us</p>
          <div className="flex flex-col items-center gap-2 lg:items-start">
            {aboutLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="text-base font-light duration-300 hover:text-blue-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex basis-[20%] flex-col items-center gap-4 lg:items-start">
          <p className="mt-4 text-xl font-semibold text-white">Contact</p>
          <div className="flex flex-col items-center gap-2 lg:items-start">
            {siteLinks.map((link, index) => (
              <div key={index}>
                {link.label === "Contact Us" ? (
                  <button
                    onClick={() => onOpen("contactUsModal")}
                    className="text-base font-light duration-300 hover:text-blue-100"
                  >
                    {link.label}
                  </button>
                ) : link.label === "Privacy Policy" ? (
                  <button
                    onClick={() => onOpen("privacyPolicyModal")}
                    className="text-base font-light duration-300 hover:text-blue-100"
                  >
                    {link.label}
                  </button>
                ) : link.label === "Terms of Service" ? (
                  <button
                    onClick={() => onOpen("termsOfServiceModal")}
                    className="text-base font-light duration-300 hover:text-blue-100"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={index}
                    href={link.url}
                    className="text-base font-light duration-300 hover:text-blue-100"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex basis-[20%] flex-col items-center gap-4 lg:items-start">
          <p className="mt-4 text-xl font-semibold text-white">Social Media</p>
          <Link
            href="https://www.facebook.com/Codebilitydev"
            target="_blank"
            className="text-base font-light duration-300 hover:text-blue-100"
          >
            Codebility on Facebook
          </Link>
        </div>
      </div>

      <div className="border-darkgray flex items-center justify-center border-t p-8">
        <p className="text-lg">
          Copyright {new Date().getFullYear()} Codebility. All Right Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
