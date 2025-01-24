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

/** Applicants Table Desktop */
const ApplicantsTableDesktop = ({ applicants }: { applicants: Codev[] }) => {
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
        {applicants.length > 0 &&
          applicants.map((applicant) => (
            <TableRow key={applicant.id} className="grid grid-cols-12">
              <TableCell className="col-span-3 flex items-center gap-3">
                <Checkbox />
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
                      <p className="capitalize hover:underline">
                        {applicant.first_name} {applicant.last_name}
                      </p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex gap-4">
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
              <TableCell>
                <Link href={`mailto:${applicant.email_address}`}>
                  <IconEmail />
                </Link>
              </TableCell>
              <TableCell>
                {applicant.github && (
                  <Link href={applicant.github}>
                    <IconGithub />
                  </Link>
                )}
              </TableCell>
              <TableCell>
                {applicant.portfolio_website && (
                  <Link href={applicant.portfolio_website}>
                    <IconLink />
                  </Link>
                )}
              </TableCell>
              <TableCell className="col-span-3">
                {applicant.tech_stacks.map((stack) => (
                  <Image
                    key={stack}
                    src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                    alt={stack}
                    width={25}
                    height={25}
                  />
                ))}
              </TableCell>
              <TableCell className="col-span-3">
                <ApplicantsApprovalButtons applicant={applicant} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
``;

export default ApplicantsTableDesktop;
