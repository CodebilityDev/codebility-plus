"use client"

import React from "react"
import { Paragraph } from "@/Components/shared/home"
import Logo from "@/Components/shared/Logo"
import { Button } from "@/Components/ui/button"
import { API } from "@/lib/constants"
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
} from "@/public/assets/svgs"
import { User } from "@/types"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import getRandomColor from "@/lib/getRandomColor"

interface CodevBioPageProps {
  params: {
    id: string
  }
}

const CodevBioPage: React.FC<CodevBioPageProps> = ({ params }) => {
  const id = params.id
  const [data, setData] = useState<User | null>(null)
  const [, setIsLoading] = useState(true)

  const {
    first_name,
    last_name,
    about_me,
    image_url,
    address,
    phone_no,
    jobStatusType,
    email_address,
    github_link,
    fb_link,
    linkedin_link,
    Work_Experience,
    portfolio_website,
    tech_stacks,
    education,
    main_position,
  } = data || {}

  useEffect(() => {
    const fetchUsersData = async (id: string) => {
      try {
        const response = await axios(API.USERS + id)
        if (!response) {
          throw new Error("Failed to fetch data from the server.")
        }
        setData(response.data.data)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsersData(id)
  }, [id])

  function getCurrentYear() {
    return new Date().getFullYear()
  }

  return (
    <section className="relative min-h-screen w-full bg-gradient-to-l from-black-500 to-black-100">
      <div className="absolute inset-0 bg-section-wrapper bg-fixed bg-repeat opacity-20"></div>
      <div className="relative px-5 py-5 md:px-10 md:py-10 lg:px-32 lg:py-20">
        <div className="flex justify-between gap-2">
          <Logo />
          <Link href="/">
            <Button
              variant="hollow"
              className="flex gap-2 border-zinc-700 bg-black-200 text-white"
              onClick={() => window.close()}
            >
              Close
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-6 md:gap-12 lg:mt-16 lg:flex-row">
          <div className="flex h-auto w-full basis-[30%] flex-col items-center justify-start gap-4 rounded-lg bg-black-500 p-6 text-white shadow-lg lg:p-8">
            <div className="relative">
              <Image
                alt={`${first_name} Avatar`}
                src={image_url || "/assets/svgs/icon-codebility-black.svg"}
                width={130}
                height={130}
                className={`bg-${getRandomColor} h-[120px] w-[120px] rounded-full bg-cover object-cover p-0.5`}
              />
              <div className="absolute bottom-[7px] right-[7px]">
                <p
                  className={`rounded-full border-2 border-black-100 p-2 text-[9px] ${
                    jobStatusType === "AVAILABLE"
                      ? "bg-green"
                      : jobStatusType === "DEPLOYED"
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
              <div className="rounded-lg bg-darkgray px-4 py-2">
                {main_position && (
                  <p className="text-center text-sm capitalize text-gray lg:text-lg">{main_position}</p>
                )}
              </div>
            )}
            <div className="flex gap-4">
              {fb_link && (
                <Link
                  className="rounded-lg bg-darkgray p-2 transition duration-300 hover:bg-black-100"
                  href={fb_link}
                  target="_blank"
                >
                  <IconFacebook className="text-2xl" />
                </Link>
              )}
              {github_link && (
                <Link
                  className="rounded-lg bg-darkgray p-2 transition duration-300 hover:bg-black-100"
                  href={github_link}
                  target="_blank"
                  title={`${github_link}`}
                >
                  <IconGithub className="text-2xl" />
                </Link>
              )}
              {linkedin_link && (
                <Link
                  className="rounded-lg bg-darkgray p-2 transition duration-300 hover:bg-black-100"
                  href={linkedin_link}
                  target="_blank"
                >
                  <IconLinkedIn className="text-2xl" />
                </Link>
              )}
              {portfolio_website && (
                <Link
                  className="rounded-lg bg-darkgray p-2 transition duration-300 hover:bg-black-100"
                  href={portfolio_website}
                  target="_blank"
                  title={`${portfolio_website}`}
                >
                  <IconLink className="text-2xl" />
                </Link>
              )}
            </div>

            <div className="mt-4 flex h-auto w-full flex-col gap-4 rounded-lg bg-black-100 p-4">
              <div className="flex items-center gap-4">
                <Link
                  className="rounded-lg bg-darkgray p-2 transition duration-300 hover:bg-black-500"
                  href={`mailto:${email_address}`}
                  title={`${email_address}`}
                >
                  <IconMail className="text-2xl" />
                </Link>
                <div className="flex flex-col">
                  <p className="text-md text-gray">Email</p>
                  <Link
                    href={`mailto:${email_address}`}
                    title={`${email_address}`}
                    className="text-white transition duration-300 hover:text-blue-100"
                  >
                    {email_address}
                  </Link>
                </div>
              </div>
              {address && <div className="border-t border-darkgray"></div>}
              {phone_no && (
                <>
                  <div className="flex items-center gap-4">
                    <Link
                      className="rounded-lg bg-darkgray p-2 transition duration-300 hover:bg-black-500"
                      href={`mailto:${phone_no}`}
                      title={`${phone_no}`}
                    >
                      <IconTelephone className="text-2xl" />
                    </Link>
                    <div className="flex flex-col">
                      <p className="text-md text-gray">Phone</p>
                      <Link
                        href={`tel:${phone_no}`}
                        title={`${phone_no}`}
                        className="text-white transition duration-300 hover:text-blue-100"
                      >
                        {phone_no}
                      </Link>
                    </div>
                  </div>
                  <div className="border-t border-darkgray"></div>
                </>
              )}
              {address && (
                <div className="flex items-center gap-4">
                  <Link
                    className="rounded-lg bg-darkgray p-2 transition duration-300 hover:bg-black-500"
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
                      className="text-white transition duration-300 capitalize hover:text-blue-100"
                    >
                      {address}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* <Button className="mt-4">Download CV</Button> */}
          </div>
          <div className="flex basis-[70%] flex-col gap-6 rounded-lg bg-black-500 p-6 text-white shadow-lg lg:gap-14 lg:p-8">
            {about_me && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <IconAbout className="text-2xl" />
                  <h3 className="text-md font-semibold lg:text-2xl">About</h3>
                </div>
                <p className="text-md text-gray lg:text-lg">{about_me}</p>
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
                    <div key={i} className="flex items-center rounded-lg bg-darkgray p-2">
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
            {Work_Experience && Work_Experience.length > 0 && <div>
              <div className="mb-4 flex items-center gap-2">
                <IconBag className="text-2xl" />
                <h3 className="text-md font-semibold lg:text-2xl">Experience</h3>
              </div>
              <div className="flex flex-col gap-6 md:gap-8">
                {Work_Experience.map((exp, expNo) => (
                  <div key={`experience-${expNo}`} className="flex flex-col gap-4 rounded-lg bg-black-100 p-6">
                    <div>
                      <p className="text-lg font-semibold text-white lg:text-xl">{exp.position}</p>
                      {exp.company && <p className="text-md font-semibold text-gray lg:text-lg">{exp.company}</p>}
                      <p className="text-sm text-gray lg:text-lg">
                        {exp.dateFrom} - {exp.dateTo}
                      </p>
                    </div>
                    <p>{exp.short_desc}</p>
                  </div>
                ))}
              </div>
            </div>}
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
        <Paragraph>© {getCurrentYear()} Codebility. All Right Reserved</Paragraph>
      </div>
    </section>
  )
}
export default CodevBioPage
