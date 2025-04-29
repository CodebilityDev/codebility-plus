"use client";

import Link from "next/link";
import Logo from "@/Components/shared/Logo";
import { footerLinks } from "@/constants/links";
import { ModalType, useModal } from "@/hooks/use-modal";
import { IconFacebookWhite } from "@/public/assets/svgs";

import { aboutUsData, connectUsData } from "../../../constants/landing_data";
import Container from "./MarketingContainer";

const Footer = () => {
  const { onOpen } = useModal();

  return (
    <section className="w-full xl:mb-6">
      <Container className="bg-black-600 mx-auto flex flex-col gap-2 text-white xl:rounded-3xl">
        <div className="flex flex-col gap-4 md:p-8 lg:flex-row lg:gap-6">
          <div className="flex basis-[25%] flex-col gap-2">
            <Logo />
            <h3 className="text-gray">
              We serve as a dynamic hub for innovation, fostering a creative
              environment
            </h3>
          </div>
          <div className="flex basis-[70%] flex-col gap-6 lg:flex-row lg:gap-20">
            <div className="text-gray flex flex-1 flex-col gap-2">
              <h4 className="pb-1 text-lg text-white">About us</h4>
              <div className="flex flex-wrap gap-4 lg:flex-col lg:gap-2">
                {aboutUsData.map((data) => (
                  <Link key={data.id} href={`${data.href}`}>
                    <p>{data.title}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-gray flex flex-1 flex-col gap-2">
              <h4 className="pb-1 text-lg text-white">Company</h4>
              <ul className="flex flex-wrap gap-4 lg:flex-col lg:gap-2">
                {footerLinks.map((data) => (
                  <li key={data.id}>
                    <button onClick={() => onOpen(data.href as ModalType)}>
                      {data.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-gray flex flex-1 flex-col gap-2">
              <h4 className="pb-1 text-lg text-white">Connect Us</h4>
              <div className="flex items-center gap-4">
                {connectUsData.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Link key={social.id} href={social.href} target="_blank">
                      <IconComponent
                        className={`${
                          IconComponent === IconFacebookWhite
                            ? "h-[25px] w-[25px]"
                            : "h-[32px] w-[32px]"
                        }`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="border-darkgray flex border-t px-0 py-3 md:p-8 lg:items-center lg:justify-center">
          <p className="text-md text-gray">
            Copyright {new Date().getFullYear()}{" "}
            <Link href="/">Codebility</Link>. All Right Reserved.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Footer;
