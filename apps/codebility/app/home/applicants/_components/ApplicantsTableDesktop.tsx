import Image from "next/image";
import Link from "next/link";
import ApplicantsActionButtons from "@/app/home/applicants/_components/ApplicantsActionButtons";
import DefaultAvatar from "@/Components/DefaultAvatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";

import { Avatar, AvatarImage } from "@codevs/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

const ApplicantsTableDesktop = ({ applicants }: { applicants: Codev[] }) => {
  return (
    <Table className="hidden xl:block">
      <TableHeader>
        <TableRow className="border-b-2 border-gray-800">
          <TableHead className="w-3/12 py-4 text-left font-medium text-gray-300">
            Name
          </TableHead>
          <TableHead className="w-2/12 py-4 text-center font-medium text-gray-300">
            Gmail
          </TableHead>
          <TableHead className="w-2/12 py-4 text-center font-medium text-gray-300">
            Github
          </TableHead>
          <TableHead className="w-2/12 py-4 text-center font-medium text-gray-300">
            Portfolio
          </TableHead>
          <TableHead className="w-2/12 py-4 text-center font-medium text-gray-300">
            Tech Stack
          </TableHead>
          <TableHead className="w-2/12 py-4 text-center font-medium text-gray-300">
            Approval
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <TableRow
              key={applicant.id}
              className="border-b border-gray-800 hover:bg-gray-900/50"
            >
              <TableCell className="py-4">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {applicant.image_url ? (
                          <AvatarImage src={applicant.image_url} />
                        ) : (
                          <DefaultAvatar size={40} />
                        )}
                      </Avatar>
                      <p className="truncate font-medium text-gray-200 hover:underline">
                        {applicant.first_name.charAt(0).toUpperCase() +
                          applicant.first_name.slice(1)}{" "}
                        {applicant.last_name.charAt(0).toUpperCase() +
                          applicant.last_name.slice(1)}
                      </p>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="background-box w-96 border border-gray-700 p-4 shadow-lg">
                    <div className="flex gap-4">
                      {applicant.image_url ? (
                        <Image
                          src={applicant.image_url}
                          alt={`${applicant.first_name} avatar`}
                          width={100}
                          height={100}
                          className="rounded-md"
                        />
                      ) : (
                        <DefaultAvatar size={100} className="rounded-md" />
                      )}
                      <div className="text-gray-200">
                        <h4 className="text-lg font-medium">
                          {applicant.first_name.charAt(0).toUpperCase() +
                            applicant.first_name.slice(1)}{" "}
                          {applicant.last_name.charAt(0).toUpperCase() +
                            applicant.last_name.slice(1)}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {applicant.email_address}
                        </p>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex justify-center">
                  <Link
                    href={`mailto:${applicant.email_address}`}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <IconEmail />
                  </Link>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex justify-center">
                  {applicant.github && (
                    <Link
                      href={applicant.github}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <IconGithub />
                    </Link>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex justify-center">
                  {applicant.portfolio_website && (
                    <Link
                      href={applicant.portfolio_website}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <IconLink />
                    </Link>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {applicant.tech_stacks?.map((stack) => (
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
              <TableCell className="py-4 text-center">
                <ApplicantsActionButtons applicant={applicant} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="py-8 text-center text-gray-400">
              No applicants found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ApplicantsTableDesktop;
