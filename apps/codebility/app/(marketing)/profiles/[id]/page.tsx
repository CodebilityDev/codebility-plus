import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Paragraph } from "@/Components/shared/home";
import Logo from "@/Components/shared/Logo";
import getRandomColor from "@/lib/getRandomColor";
import { getCodevs } from "@/lib/server/codev.service";
import {
  IconAbout,
  IconBag,
  IconFacebook,
  IconGithub,
  IconLink,
  IconLinkedIn,
  IconMail,
  IconMapPin,
  IconSkills,
  IconTelephone,
} from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";

import ProfileCloseButton from "./_components/profile-close-button";

interface Props {
  params: {
    id: string;
  };
}

export default async function CodevBioPage({ params }: Props) {
  const showWayToContact = false; // to change if client is connected to codebility.
  const id = params.id;
  const { data, error } = await getCodevs(id);

  if (error) return <div>ERROR</div>;

  const {
    email,
    first_name,
    last_name,
    image_url,
    job_status,
    main_position,
    portfolio_website,
    address,
    about,
    socials,
    education,
    tech_stacks,
    contact,
    experiences,
  } = data as Codev;

  const { facebook, linkedin, github } = socials;

  function getCurrentYear() {
    return new Date().getFullYear();
  }

  return (
    <section className="from-black-500 to-black-100 relative min-h-screen flex flex-col bg-gradient-to-l">
      <div className="bg-section-wrapper absolute inset-0 bg-fixed bg-repeat opacity-20"></div>


      <div className="relative flex-grow px-5 py-5 md:px-10 md:py-10 lg:px-32 lg:py-20">
        <div className="flex justify-between gap-2">
          <Logo />
          <ProfileCloseButton />
        </div>

        <div className="mt-6 flex flex-col gap-6 md:gap-12 lg:mt-16 lg:flex-row">
          <div className="bg-black-500 flex h-auto w-full basis-[30%] flex-col items-center justify-start gap-4 rounded-lg p-6 text-white shadow-lg lg:p-8">
            <div className="relative">
              <Image
                alt={`${first_name} Avatar`}
                src={
                  image_url
                    ? `${image_url}`
                    : "/assets/svgs/icon-codebility-black.svg"
                }
                width={130}
                height={130}
                className={`bg-${getRandomColor} h-[120px] w-[120px] rounded-full bg-cover object-cover p-0.5`}
              />
              <div className="absolute bottom-[7px] right-[7px]">
                <p
                  className={`border-black-100 rounded-full border-2 p-2 text-[9px] ${
                    job_status === "AVAILABLE"
                      ? "bg-green"
                      : job_status === "DEPLOYED"
                        ? "bg-orange-400"
                        : "bg-green"
                  }`}
                ></p>
              </div>
            </div>

            <p className="text-md text-center capitalize lg:text-2xl">
              {first_name && first_name.length > 0 ? first_name : "Null"}{" "}
              {last_name && last_name.length > 0 ? last_name : "Null"}
            </p>
            {main_position && (
              <div className="bg-darkgray rounded-lg px-4 py-2">
                {main_position && (
                  <p className="text-gray text-center text-sm capitalize lg:text-lg">
                    {main_position}
                  </p>
                )}
              </div>
            )}
            {showWayToContact && (
              <div>
                <div className="flex gap-4">
                  {facebook && (
                    <Link
                      className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                      href={facebook}
                      target="_blank"
                    >
                      <IconFacebook className="text-2xl" />
                    </Link>
                  )}
                  {github && (
                    <Link
                      className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                      href={github}
                      target="_blank"
                      title={`${github}`}
                    >
                      <IconGithub className="text-2xl" />
                    </Link>
                  )}
                  {linkedin && (
                    <Link
                      className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                      href={linkedin}
                      target="_blank"
                    >
                      <IconLinkedIn className="text-2xl" />
                    </Link>
                  )}
                  {portfolio_website && (
                    <Link
                      className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                      href={portfolio_website}
                      target="_blank"
                      title={`${portfolio_website}`}
                    >
                      <IconLink className="text-2xl" />
                    </Link>
                  )}
                </div>

                <div className="bg-black-100 mt-4 flex h-auto w-full flex-col gap-4 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Link
                      className="bg-darkgray hover:bg-black-500 rounded-lg p-2 transition duration-300"
                      href={`mailto:${email}`}
                      title={`${email}`}
                    >
                      <IconMail className="text-2xl" />
                    </Link>
                    <div className="flex flex-col">
                      <p className="text-md text-gray">Email</p>
                      <Link
                        href={`mailto:${email}`}
                        title={`${email}`}
                        className="text-white transition duration-300 hover:text-blue-100"
                      >
                        {email}
                      </Link>
                    </div>
                  </div>
                  {address && <div className="border-darkgray border-t"></div>}
                  {contact && (
                    <>
                      <div className="flex items-center gap-4">
                        <Link
                          className="bg-darkgray hover:bg-black-500 rounded-lg p-2 transition duration-300"
                          href={`mailto:${contact}`}
                          title={`${contact}`}
                        >
                          <IconTelephone className="text-2xl" />
                        </Link>
                        <div className="flex flex-col">
                          <p className="text-md text-gray">Phone</p>
                          <Link
                            href={`tel:${contact}`}
                            title={`${contact}`}
                            className="text-white transition duration-300 hover:text-blue-100"
                          >
                            {contact}
                          </Link>
                        </div>
                      </div>
                      <div className="border-darkgray border-t"></div>
                    </>
                  )}
                </div>

                <div className="flex gap-4">
                  {portfolio_website && (
                    <Link
                      className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                      href={portfolio_website}
                      target="_blank"
                      title={`${portfolio_website}`}
                    >
                      <IconLink className="text-2xl" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            <div className="bg-black-100 mt-4 flex h-auto w-full flex-col gap-4 rounded-lg p-4">
              {address && (
                <div className="flex items-center gap-4">
                  <Link
                    className="bg-darkgray hover:bg-black-500 rounded-lg p-2 transition duration-300"
                    href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
                    title={`${address}`}
                    target="_blank"
                  >
                    <IconMapPin className="text-2xl" />
                  </Link>
                  <div className="flex flex-col">
                    <p className="text-md text-gray">Location</p>
                    <Link
                      href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
                      title={`${address}`}
                      target="_blank"
                      className="capitalize text-white transition duration-300 hover:text-blue-100"
                    >
                      {address}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* <Button className="mt-4">Download CV</Button> */}
          </div>
          <div className="bg-black-500 flex basis-[70%] flex-col gap-6 rounded-lg p-6 text-white shadow-lg lg:gap-14 lg:p-8">
            {about && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <IconAbout className="text-2xl" />
                  <h3 className="text-md font-semibold lg:text-2xl">About</h3>
                </div>
                <p className="text-md text-gray lg:text-lg">{about}</p>
              </div>
            )}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <IconSkills className="text-2xl" />
                <h3 className="text-md font-semibold lg:text-2xl">Skills</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                {tech_stacks &&
                  tech_stacks.map((stack: any, i: any) => (
                    <div
                      key={i}
                      className="bg-darkgray flex items-center rounded-lg p-2"
                    >
                      <Image
                        src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                        alt={stack + " icon"}
                        width={35}
                        height={35}
                        title={stack}
                        className="h-[35px] w-[35px] transition duration-300 hover:-translate-y-0.5"
                      />
                    </div>
                  ))}
              </div>
            </div>
            {experiences && experiences.length > 0 && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <IconBag className="text-2xl" />
                  <h3 className="text-md font-semibold lg:text-2xl">
                    Experience
                  </h3>
                </div>
                <div className="flex flex-col gap-6 md:gap-8">
                  {experiences.map((exp, expNo) => (
                    <div
                      key={`experience-${expNo}`}
                      className="bg-black-100 flex flex-col gap-4 rounded-lg p-6"
                    >
                      <div>
                        <p className="text-lg font-semibold text-white lg:text-xl">
                          {exp.position}
                        </p>
                        {exp.company && (
                          <p className="text-md text-gray font-semibold lg:text-lg">
                            {exp.company}
                          </p>
                        )}
                        <p className="text-gray text-sm lg:text-lg">
                          {exp.date_from} - {exp.date_to}
                        </p>
                      </div>
                      <p>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {education && (
              <div>
                <h3 className="text-md font-semibold lg:text-2xl">Education</h3>
                <p className="text-md text-gray lg:text-lg">{education}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col items-center gap-4 pb-10">
        <Logo />
        <Paragraph>
          © {getCurrentYear()} Codebility. All Right Reserved
        </Paragraph>
      </div>
    </section>
  );
}
