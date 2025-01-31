"use client";

import Image from "next/image";
import Link from "next/link";
import Badges from "@/Components/shared/Badges";
import Box from "@/Components/shared/dashboard/Box";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { techstacks } from "@/constants/techstack";
import { useModal } from "@/hooks/use-modal-users";
import { defaultAvatar } from "@/public/assets/images";
import { Codev } from "@/types/home/codev";

const ProfileModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isModalOpen = isOpen && type === "profileModal";

  const codevData = (data as Codev) || {};
  const {
    first_name,
    last_name,
    image_url,
    address,
    about,
    facebook,
    github,
    linkedin,
    discord,
    display_position,
    internal_status,
    tech_stacks,
  } = codevData;

  // If you fetch projects in the future, store them in codevData.projects or something
  const projects: any[] = [];

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="mx-auto flex h-[32rem] w-[90%] max-w-4xl flex-col overflow-y-scroll md:h-[44rem] md:flex-row"
      >
        <DialogHeader className="relative hidden">
          <DialogTitle className="mb-2 text-left text-xl">
            User Profile
          </DialogTitle>
        </DialogHeader>

        {/* LEFT COLUMN: Avatar + Basic Info */}
        <Box className="bg-light-700 mx-auto flex w-full flex-col items-center justify-center gap-6 rounded-lg border-none text-center md:w-1/3">
          <div className="from-violet relative size-24 self-center rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover">
            <Image
              alt={`${first_name} Avatar`}
              src={image_url || defaultAvatar}
              fill
              className="h-[70px] w-[70px] rounded-full bg-cover object-cover p-0.5"
              loading="eager"
            />
          </div>

          <div className="bg-light-800 dark:bg-dark-400 flex w-full flex-col items-center p-4 py-3">
            <p className="text-2xl font-semibold capitalize">
              {first_name} {last_name}
            </p>
            {display_position ? (
              <p className="dark:text-lightgray font-extralight capitalize">
                {display_position}
              </p>
            ) : null}
            <p className="font-normal capitalize">{address}</p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 py-1">
            <p className="dark:text-gray">Status</p>
            <p
              className={`w-min rounded-md px-3 py-1 ${
                internal_status === "AVAILABLE"
                  ? "bg-codeGreen"
                  : internal_status === "DEPLOYED"
                    ? "bg-codeViolet"
                    : "bg-gray"
              }`}
            >
              {internal_status &&
                internal_status.charAt(0) +
                  internal_status.slice(1).toLowerCase()}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 py-6">
            <p className="dark:text-gray">Current Project</p>
            {projects &&
              projects.map((project, index) => (
                <p
                  key={`${project.id}-${index}`}
                  className="text-2xl font-semibold capitalize"
                >
                  {project?.name}
                </p>
              ))}
          </div>

          <div className="pb-6">
            <p className="dark:text-gray">Badges</p>
            <Badges />
          </div>
        </Box>

        {/* RIGHT COLUMN: Socials, About, Skills, etc. */}
        <Box className="bg-light-700 mx-auto flex w-full flex-col gap-6 rounded-lg border-none pt-6 md:w-2/3">
          {/* Socials */}
          <div>
            <p className="dark:text-gray pb-2.5">Socials</p>
            <div className="flex items-center gap-2">
              {facebook && (
                <Link href={facebook} target="_blank">
                  <Image
                    src="/path/to/facebook-icon.svg"
                    alt="Facebook"
                    width={5}
                    height={5}
                    className="h-5 w-5 duration-300 hover:-translate-y-1"
                  />
                </Link>
              )}
              {github && (
                <Link href={github} target="_blank">
                  <Image
                    src="/path/to/github-icon.svg"
                    alt="GitHub"
                    width={5}
                    height={5}
                    className="h-5 w-5 duration-300 hover:-translate-y-1"
                  />
                </Link>
              )}
              {linkedin && (
                <Link href={linkedin} target="_blank">
                  <Image
                    src="/path/to/linkedin-icon.svg"
                    alt="LinkedIn"
                    width={5}
                    height={5}
                    className="h-5 w-5 duration-300 hover:-translate-y-1"
                  />
                </Link>
              )}
              {discord && (
                <Link href={discord} target="_blank">
                  <Image
                    src="/path/to/discord-icon.svg"
                    alt="Discord"
                    width={5}
                    height={5}
                    className="h-5 w-5 duration-300 hover:-translate-y-1"
                  />
                </Link>
              )}
            </div>
          </div>

          {/* About */}
          <div className="py-4">
            <p className="dark:text-gray pb-2.5">About Me</p>
            {about ? <p className="h-20 overflow-y-auto">{about}</p> : <p></p>}
          </div>

          {/* Skills */}
          <div className="pb-4">
            <p className="dark:text-gray pb-2.5">Skills</p>
            <div className="flex flex-wrap gap-2">
              {tech_stacks &&
                tech_stacks.map((name, index) => {
                  const tech = techstacks.find(
                    (t) => t.name.toLowerCase() === name.toLowerCase(),
                  );
                  if (!tech) return null;
                  const { icon: Icon } = tech;
                  return (
                    <Link key={`${name}-${index}`} href="#" target="_blank">
                      <Icon className="h-5 w-5 duration-300 hover:-translate-y-1" />
                    </Link>
                  );
                })}
            </div>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
