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
  IconMapPin,
  IconSkills,
} from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";

import ProfileCloseButton from "./_components/ProfileCloseButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CodevBioPage(props: Props) {
  const params = await props.params;
  const id = params.id;

  // Fetch data for the profile
  const { data, error } = await getCodevs({ filters: { id } });

  if (error) {
    console.error("Failed to fetch Codev data:", error);
    return <div>ERROR: Failed to fetch Codev data. {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No profiles found.</div>;
  }

  const {
    first_name,
    last_name,
    email_address,
    image_url,
    display_position,
    portfolio_website,
    address,
    about,
    facebook,
    linkedin,
    github,
    tech_stacks,
    education,
    work_experience,
    availability_status,
    nda_status,
  } = data[0] as Codev;

  const getStatusBadge = () =>
    availability_status
      ? "Available"
      : nda_status
        ? "Under NDA"
        : "Unavailable";

  const sanitizeUrl = (url: string | undefined): string => {
    if (!url) return "#";
    return url
      .replace(process.env.NEXT_PUBLIC_APP_BASE_URL || "", "")
      .replace(process.env.NEXT_PUBLIC_APP_BASE_URL || "", "");
  };

  const getRandomBgColor = () => `bg-${getRandomColor()}`;

  return (
    <section className="from-black-500 to-black-100 relative flex min-h-screen flex-col bg-gradient-to-l">
      <div className="bg-section-wrapper absolute inset-0 bg-fixed bg-repeat opacity-20"></div>

      <div className="relative flex-grow px-5 py-5 md:px-10 md:py-10 lg:px-32 lg:py-20">
        <div className="flex justify-between gap-2">
          <Logo />
          <ProfileCloseButton />
        </div>

        <div className="mt-6 flex flex-col gap-6 md:gap-12 lg:mt-16 lg:flex-row">
          {/* Left Section */}
          <div className="bg-black-500 flex h-auto w-full basis-[30%] flex-col items-center justify-start gap-4 rounded-lg p-6 text-white shadow-lg lg:p-8">
            <div className="relative">
              <Image
                alt={`${first_name} Avatar`}
                src={image_url || "/assets/svgs/icon-codebility-black.svg"}
                width={200}
                height={200}
                className={`${getRandomBgColor()} h-[150px] w-[150px] rounded-full bg-cover object-cover`}
              />
              <div className="absolute bottom-[7px] right-[7px]">
                <p
                  className={`border-black-100 rounded-full px-2 text-[9px] ${
                    availability_status ? "bg-green" : "bg-gray"
                  }`}
                >
                  {getStatusBadge()}
                </p>
              </div>
            </div>
            <p className="text-md text-center capitalize lg:text-2xl ">
              {first_name || "Unknown"} {last_name || "Unknown"}
            </p>
            {display_position && (
              <div className="bg-darkgray rounded-lg px-4 py-2">
                <p className=" text-center text-sm capitalize lg:text-lg">
                  {display_position}
                </p>
              </div>
            )}
            <div className="flex gap-4">
              {facebook && (
                <Link
                  href={sanitizeUrl(facebook)}
                  target="_blank"
                  className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                >
                  <Image
                    src={IconFacebook}
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </Link>
              )}
              {linkedin && (
                <Link
                  href={sanitizeUrl(linkedin)}
                  target="_blank"
                  className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                >
                  <Image
                    src={IconLinkedIn}
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </Link>
              )}
              {github && (
                <Link
                  href={sanitizeUrl(github)}
                  target="_blank"
                  className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                >
                  <Image
                    src={IconGithub}
                    alt="GitHub"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </Link>
              )}
              {portfolio_website && (
                <Link
                  href={sanitizeUrl(portfolio_website)}
                  target="_blank"
                  className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300"
                >
                  <Image
                    src={IconLink}
                    alt="Portfolio"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </Link>
              )}
            </div>
            {tech_stacks && tech_stacks.length > 0 && (
              <div className="mt-4">
                <div className="mb-4 flex items-center gap-2">
                  <Image
                    src={IconSkills}
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <h3 className="text-md font-semibold lg:text-2xl">Skills</h3>
                </div>
                <div className="mt-2 flex flex-wrap gap-4">
                  {tech_stacks.map((stack) => (
                    <Image
                      key={stack}
                      src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                      alt={stack}
                      width={25}
                      height={25}
                      className="h-6 w-6"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="bg-black-500 flex basis-[70%] flex-col gap-6 rounded-lg p-6 text-white shadow-lg lg:gap-14 lg:p-8">
            {about && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Image
                    src={IconAbout}
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <h3 className="text-md font-semibold lg:text-2xl">About</h3>
                </div>
                <p className="text-md text-gray lg:text-lg">{about}</p>
              </div>
            )}

            {education && education.length > 0 && (
              <div>
                <h3 className="text-md font-semibold lg:text-2xl">Education</h3>
                {education.map((edu) => (
                  <div key={edu.id} className="bg-black-100 rounded-lg p-6">
                    <p className="text-lg text-white">{edu.institution}</p>
                    {edu.degree && (
                      <p className="text-gray">
                        {edu.degree} ({edu.start_date || "N/A"} -{" "}
                        {edu.end_date || "Present"})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {work_experience && work_experience.length > 0 && (
              <div>
                <h3 className="text-md mb-4 font-semibold lg:text-2xl">
                  Experience
                </h3>
                {work_experience.map((exp) => (
                  <div key={exp.id} className="bg-black-100 rounded-lg p-6">
                    <p className="text-lg font-semibold text-white">
                      {exp.position}
                    </p>
                    <p className="text-md text-gray font-semibold">
                      <span className="text-violet mr-2">
                        {exp.company_name.toUpperCase()}
                      </span>
                      ({exp.date_from} - {exp.date_to || "Present"})
                    </p>
                    <p className="text-md text-gray font-semibold ">
                      @{exp.location}
                    </p>
                    <p className="text-gray">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-4 pb-10">
        <Logo />
        <Paragraph>© 2023 Codebility. All Rights Reserved</Paragraph>
      </div>
    </section>
  );
}
