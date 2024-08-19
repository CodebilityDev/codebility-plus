import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import { User } from "@/types"
import { pageSize } from "@/constants"
import useToken from "@/hooks/use-token"
import usePagination from "@/hooks/use-pagination"
import { Checkbox } from "@codevs/ui/checkbox"
import DefaultPagination from "@/Components/ui/pagination"
import { approveApplicant, denyApplicant } from "@/app/api/applicants"
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@codevs/ui/accordion"

const ApplicantTable = ({ applicants }: { applicants: User[] }) => {
  const { token } = useToken()
  const [isLoading, setIsLoading] = useState(false)

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedApplicants,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(applicants || [], pageSize.applicants)

  const handleAccept = async (email_address: string) => {
    try {
      setIsLoading(true)
      const response = await approveApplicant({ email_address: email_address }, token)

      if (response.status === 200) {
        toast.success("Applicant has been approved")
      }
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeny = async (email_address: string) => {
    try {
      setIsLoading(true)
      const response = await denyApplicant({ email_address: email_address }, token)

      if (response.status === 200) {
        toast.success("Applicant has been denied")
      }
      setIsLoading(false)
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* large screen */}
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
          {applicants.length > 0 &&
            paginatedApplicants.map(
              ({ id, first_name, last_name, email_address, github_link, portfolio_website, tech_stacks }: User) => (
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
                    <button
                      className="h-max w-max rounded-md bg-blue-100 px-4 py-1 text-white transition duration-300 hover:bg-blue-500"
                      onClick={() => handleAccept(email_address as string)}
                      disabled={isLoading}
                    >
                      Accept
                    </button>
                    <button
                      className="h-max w-max rounded-md border border-none px-4 py-1 hover:underline"
                      onClick={() => handleDeny(email_address as string)}
                      disabled={isLoading}
                    >
                      Deny
                    </button>
                  </TableCell>
                </TableRow>
              )
            )}
        </TableBody>
        <TableCaption className="text-right">
          {paginatedApplicants.length === 1
            ? `${paginatedApplicants.length} item`
            : paginatedApplicants.length > 0
            ? `${paginatedApplicants.length} items`
            : "The applicants list is empty at the moment."}
        </TableCaption>
      </Table>

      {/* small screen */}
      <div className="block xl:hidden">
        {applicants.length > 0 &&
          paginatedApplicants.map(
            ({ id, first_name, last_name, email_address, github_link, portfolio_website, tech_stacks }: User) => (
              <Accordion key={id} type="single" collapsible className="w-full">
                <AccordionItem value={last_name} className="border-zinc-300 dark:border-zinc-800">
                  <AccordionTrigger className="flex p-4 text-base hover:bg-muted/50 md:text-lg ">
                    <div className="flex w-1/2 justify-start">
                      <p className="capitalize">
                        {first_name} {last_name}
                      </p>
                    </div>
                    <div className="flex w-1/2 justify-end pr-4 md:pr-8">
                      <button
                        className="h-max w-max rounded-md bg-blue-100 px-4 py-1 text-white transition duration-300 hover:bg-blue-500"
                        onClick={() => handleAccept(email_address as string)}
                        disabled={isLoading}
                      >
                        Accept
                      </button>
                      <button
                        className="h-max w-max rounded-md border border-none px-4 py-1 hover:underline"
                        onClick={() => handleDeny(email_address as string)}
                        disabled={isLoading}
                      >
                        Deny
                      </button>
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
      </div>

      {/* pagination */}
      <div className="relative w-full">
        {applicants.length > pageSize.applicants && (
          <DefaultPagination
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default ApplicantTable
