import Image from "next/image";
import Link from "next/link";
import ApplicantsActionButtons from "@/app/home/applicants/_components/ApplicantsActionButtons";
import DefaultAvatar from "@/Components/DefaultAvatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@codevs/ui/accordion";
import { Avatar, AvatarImage } from "@codevs/ui/avatar";

const ApplicantsTableMobile = ({ applicants }: { applicants: Codev[] }) => {
  const applicantsLen = applicants?.length || 0;

  return (
    <div className="block xl:hidden">
      {applicantsLen > 0 &&
        applicants.map((applicant) => (
          <Accordion
            key={applicant.id}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem
              value={applicant.last_name}
              className="border-zinc-300 dark:border-zinc-800"
            >
              <AccordionTrigger className="flex p-4 text-base hover:bg-muted/50 md:text-lg ">
                <div className="flex items-center justify-start gap-3 md:w-1/2">
                  <Avatar>
                    {applicant.image_url ? (
                      <AvatarImage src={applicant.image_url} />
                    ) : (
                      <DefaultAvatar size={40} />
                    )}
                  </Avatar>
                  <p className="border-2 text-sm capitalize">
                    {applicant.first_name} {applicant.last_name}
                  </p>
                </div>
                <div className="hidden w-1/2 justify-end pr-4 md:flex md:pr-8">
                  <ApplicantsActionButtons applicant={applicant} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <Table className="text-dark100_light900">
                  <TableHeader>
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Email</TableCell>
                      <TableCell>
                        <Link href={`mailto:${applicant.email_address}`}>
                          <IconEmail className="h-[18px] w-[18px] invert dark:invert-0" />
                        </Link>
                      </TableCell>
                    </TableRow>
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Github</TableCell>
                      <TableCell>
                        {applicant.github && (
                          <Link href={applicant.github} target="_blank">
                            <IconGithub className="h-[18px] w-[18px] invert dark:invert-0" />
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Portfolio</TableCell>
                      <TableCell>
                        {applicant.portfolio_website && (
                          <Link
                            href={applicant.portfolio_website}
                            target="_blank"
                          >
                            <IconLink className="h-[18px] w-[18px] invert dark:invert-0" />
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Tech Stack</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {applicant.tech_stacks &&
                            applicant.tech_stacks.map((stack, i) => (
                              <Image
                                key={i}
                                src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                                alt={`${stack} icon`}
                                width={25}
                                height={25}
                                title={stack}
                                className="h-[25px] w-[25px] transition duration-300 hover:-translate-y-0.5"
                              />
                            ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <ApplicantsActionButtons applicant={applicant} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
    </div>
  );
};

export default ApplicantsTableMobile;
