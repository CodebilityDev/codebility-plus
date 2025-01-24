import Image from "next/image";
import Link from "next/link";
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
import { Codev } from "@/types/home/codev";

import { Avatar, AvatarFallback, AvatarImage } from "@codevs/ui/avatar";
import { Checkbox } from "@codevs/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

import { DEFAULT_AVATAR } from "../_lib/constants";
import ApplicantsApprovalButtons from "./applicants-action-buttons";

const ApplicantsTableDesktop = ({ applicants }: { applicants: Codev[] }) => {
  return (
    <Table className="text-dark100_light900 hidden xl:block">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/12 text-left">Select</TableHead>
          <TableHead className="w-2/12 text-left">Name</TableHead>
          <TableHead className="w-2/12 text-center">Gmail</TableHead>
          <TableHead className="w-2/12 text-center">Github</TableHead>
          <TableHead className="w-2/12 text-center">Portfolio</TableHead>
          <TableHead className="w-2/12 text-center">Tech Stack</TableHead>
          <TableHead className="w-2/12 text-center">Approval</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell className="text-center">
                <Checkbox />
              </TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={applicant.image_url || DEFAULT_AVATAR}
                        />
                        <AvatarFallback>
                          {applicant.first_name[0]?.toUpperCase()}
                          {applicant.last_name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="truncate capitalize hover:underline">
                        {applicant.first_name} {applicant.last_name}
                      </p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex gap-4 ">
                      <Image
                        src={applicant.image_url || DEFAULT_AVATAR}
                        alt={`${applicant.first_name} avatar`}
                        width={100}
                        height={100}
                        className="rounded-md"
                      />
                      <div>
                        <h4>
                          {applicant.first_name} {applicant.last_name}
                        </h4>
                        <p>{applicant.email_address}</p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell className="flex items-center justify-center  text-center">
                <Link href={`mailto:${applicant.email_address}`}>
                  <IconEmail />
                </Link>
              </TableCell>
              <TableCell className="items-center justify-center text-center">
                {applicant.github && (
                  <Link href={applicant.github}>
                    <IconGithub />
                  </Link>
                )}
              </TableCell>
              <TableCell className="items-center justify-center text-center">
                {applicant.portfolio_website && (
                  <Link href={applicant.portfolio_website}>
                    <IconLink />
                  </Link>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {applicant.tech_stacks.map((stack) => (
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
              </TableCell>
              <TableCell className="text-center">
                <ApplicantsApprovalButtons applicant={applicant} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No applicants found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ApplicantsTableDesktop;
