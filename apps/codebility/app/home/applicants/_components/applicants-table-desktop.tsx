import Image from "next/image";
import Link from "next/link";
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs";

import { Avatar, AvatarFallback, AvatarImage } from "@codevs/ui/avatar";
import { Checkbox } from "@codevs/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

import { DEFAULT_AVATAR } from "../_lib/constants";
import ApplicantsActionButtons from "./applicants-action-buttons";

const ApplicantsTableDesktop = ({
  applicants,
}: {
  applicants: ApplicantsList_Types[];
}) => {
  const applicantsLen = applicants?.length as number;
  return (
    <Table className="text-dark100_light900 hidden xl:block">
      <TableHeader>
        <TableRow className="grid grid-cols-12 p-2">
          <TableHead className="col-span-3">Name</TableHead>
          <TableHead className="text-center">Gmail</TableHead>
          <TableHead className="text-center">Github</TableHead>
          <TableHead className="text-center">Portfolio</TableHead>
          <TableHead className="col-span-3 text-center">Tech Stack</TableHead>
          <TableHead className="col-span-3 text-center">Approval</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="grid grid-cols-1">
        {applicantsLen > 0 &&
          applicants.map(
            ({
              id,
              first_name,
              last_name,
              email_address,
              github_link,
              portfolio_website,
              tech_stacks,
              image_url,
            }: ApplicantsList_Types) => (
              <TableRow key={id} className="grid grid-cols-12">
                <TableCell className="col-span-3 flex items-center gap-3">
                  <Checkbox className="border-black-400 dark:border-white" />
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex cursor-pointer items-center gap-3">
                        <Avatar>
                          <AvatarImage src={image_url || DEFAULT_AVATAR} />
                          <AvatarFallback>
                            {first_name[0]?.toUpperCase()}
                            {last_name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-base capitalize hover:underline">
                          {first_name} {last_name}
                        </p>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="dark:bg-black-200 w-auto">
                      <div className="flex justify-between space-x-4">
                        <Image
                          src={image_url || DEFAULT_AVATAR}
                          alt={`${first_name} avatar`}
                          width={1000}
                          height={1000}
                          className="h-40 w-40 rounded-md object-cover"
                        />
                        <div className="text-sm space-y-2">
                          <div className="space-y-1">
                            <h4 className="font-semibold capitalize">
                              {first_name} {last_name}
                            </h4>
                            <p>{email_address}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {github_link && (
                              <Link href={github_link} target="_blank">
                                <div className="flex justify-center">
                                  <IconGithub className="h-[18px] w-[18px] invert dark:invert-0" />
                                </div>
                              </Link>
                            )}
                            {portfolio_website && (
                              <Link href={portfolio_website} target="_blank">
                                <div className="flex xl:justify-center">
                                  <IconLink className="h-[18px] w-[18px] invert dark:invert-0" />
                                </div>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <Link href={`mailto:${email_address}`}>
                    <div className="flex justify-center">
                      <IconEmail className="h-[18px] w-[18px] invert dark:invert-0" />
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  {github_link && (
                    <Link href={github_link} target="_blank">
                      <div className="flex justify-center">
                        <IconGithub className="h-[18px] w-[18px] invert dark:invert-0" />
                      </div>
                    </Link>
                  )}
                </TableCell>
                <TableCell>
                  {portfolio_website && (
                    <Link href={portfolio_website} target="_blank">
                      <div className="flex xl:justify-center">
                        <IconLink className="h-[18px] w-[18px] invert dark:invert-0" />
                      </div>
                    </Link>
                  )}
                </TableCell>
                <TableCell className="col-span-3 h-full w-full">
                  <div className="flex w-full flex-wrap justify-start gap-2 ">
                    {tech_stacks &&
                      tech_stacks.map((stack: any, i: any) => (
                        <div key={i} className="flex">
                          {stack && (
                            <Image
                              src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                              alt={`${stack} icon`}
                              width={25}
                              height={25}
                              title={stack}
                              className="h-[25px] w-[25px] transition duration-300 hover:-translate-y-0.5"
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </TableCell>
                <TableCell className="col-span-3 flex h-full w-full flex-row items-center justify-center gap-1">
                  <ApplicantsActionButtons
                    applicant={{
                      id,
                      first_name,
                      last_name,
                      email_address,
                      github_link,
                      portfolio_website,
                      tech_stacks,
                      image_url,
                    }}
                  />
                </TableCell>
              </TableRow>
            ),
          )}
      </TableBody>
      <TableCaption className="w-max">
        {applicantsLen === 1
          ? `${applicantsLen} item`
          : applicantsLen > 0
            ? `${applicantsLen} items`
            : "The applicants list is empty at the moment."}
      </TableCaption>
    </Table>
  );
};

export default ApplicantsTableDesktop;
