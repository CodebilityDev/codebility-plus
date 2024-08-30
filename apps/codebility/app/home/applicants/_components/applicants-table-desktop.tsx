import Link from "next/link"
import Image from "next/image"

import { Checkbox } from "@codevs/ui/checkbox"
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants"
import ApplicantsActionButtons from "./applicants-action-buttons"

const ApplicantsTableDesktop = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    const applicantsLen = applicants?.length as number
    return (
        <Table className="text-dark100_light900 hidden xl:block">
            <TableHeader>
                <TableRow className="grid grid-cols-12 p-2">
                    <TableHead className="col-span-3">Name</TableHead>
                    <TableHead className="text-center">Gmail</TableHead>
                    <TableHead className="text-center">Github</TableHead>
                    <TableHead className="text-center">Portfolio</TableHead>
                    <TableHead className="col-span-4 text-center">Tech Stack</TableHead>
                    <TableHead className="col-span-2 text-center">Approval</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="grid grid-cols-1">
                {applicantsLen > 0 &&
                    applicants.map(
                        ({ id, first_name, last_name, email_address, github_link, portfolio_website, tech_stacks }: ApplicantsList_Types) => (
                            <TableRow key={id} className="grid grid-cols-12">
                                <TableCell className="col-span-3 flex items-center gap-3">
                                    <Checkbox />
                                    <p className="capitalize">
                                        {first_name} {last_name}
                                    </p>
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
                                <TableCell className="col-span-4 h-full w-full">
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
                                <TableCell className="col-span-2 flex h-full w-full flex-row items-center justify-center gap-4">
                                    <ApplicantsActionButtons email_address={email_address} />
                                </TableCell>
                            </TableRow>
                        )
                    )}
            </TableBody>
            <TableCaption className="text-right">
                {applicantsLen === 1
                    ? `${applicantsLen} item`
                    : applicantsLen > 0
                        ? `${applicantsLen} items`
                        : "The applicants list is empty at the moment."}
            </TableCaption>
        </Table>
    )
}

export default ApplicantsTableDesktop
