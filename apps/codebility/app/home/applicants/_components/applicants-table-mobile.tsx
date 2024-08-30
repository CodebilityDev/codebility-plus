import Link from "next/link"
import Image from "next/image"

import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs"
import { Table, TableCell, TableHeader, TableRow } from "@/Components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@codevs/ui/accordion"
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants"
import ApplicantsActionButtons from "@/app/home/applicants/_components/applicants-action-buttons"

const ApplicantsTableMobile = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    const applicantsLen = applicants?.length as number
    return (
        <div className="block xl:hidden">
            {applicantsLen > 0 &&
                applicants.map(
                    ({ id, first_name, last_name, email_address, github_link, portfolio_website, tech_stacks }: ApplicantsList_Types) => (
                        <Accordion key={id} type="single" collapsible className="w-full">
                            <AccordionItem value={last_name} className="border-zinc-300 dark:border-zinc-800">
                                <AccordionTrigger className="flex p-4 text-base hover:bg-muted/50 md:text-lg ">
                                    <div className="flex w-1/2 justify-start">
                                        <p className="capitalize">
                                            {first_name} {last_name}
                                        </p>
                                    </div>
                                    <div className="flex w-1/2 justify-end pr-4 md:pr-8">
                                        <ApplicantsActionButtons email_address={email_address} />
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4">
                                    <Table className="text-dark100_light900">
                                        <TableHeader>
                                            <TableRow className="grid grid-cols-2 p-2">
                                                <TableCell>Gmail</TableCell>
                                                <TableCell>
                                                    <Link href={`mailto:${email_address}`}>
                                                        <div className="flex justify-center">
                                                            <IconEmail className="h-[18px] w-[18px] invert dark:invert-0" />
                                                        </div>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="grid grid-cols-2 p-2">
                                                <TableCell>Github</TableCell>
                                                <TableCell>
                                                    {github_link && (
                                                        <Link href={github_link} target="_blank">
                                                            <div className="flex justify-center">
                                                                <IconGithub className="h-[18px] w-[18px] invert dark:invert-0" />
                                                            </div>
                                                        </Link>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="grid grid-cols-2 p-2">
                                                <TableCell>Portfolio</TableCell>
                                                <TableCell>
                                                    {portfolio_website && (
                                                        <Link href={portfolio_website} target="_blank">
                                                            <div className="flex xl:justify-center">
                                                                <IconLink className="h-[18px] w-[18px] invert dark:invert-0" />
                                                            </div>
                                                        </Link>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow className="grid grid-cols-2 p-2">
                                                <TableCell>Tech Stack</TableCell>
                                                <TableCell>
                                                    <div className="flex h-full w-full flex-wrap items-center justify-start gap-2 ">
                                                        {tech_stacks &&
                                                            tech_stacks.map((stack: any, i: any) => (
                                                                <div key={i} className="flex items-center">
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
                                            </TableRow>
                                        </TableHeader>
                                    </Table>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )
                )}
        </div >
    )
}

export default ApplicantsTableMobile
