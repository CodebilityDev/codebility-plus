import { Box, H1 } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import React from "react"

export default function ApplicantsLoading() {
    return (
        <div>
            <H1>Applicants List</H1>
            <Box className="h-70 mt-6 w-full">
                <div className="hidden flex-row items-start justify-between lg:mx-10  lg:flex">
                    <Skeleton className="h-10 w-20" />
                    <div className="flex flex-row items-center justify-center">
                        {Array(4)
                            .fill(null)
                            .map((_, index) => (
                                <div key={index} className="lg:px-2">
                                    <Skeleton className="h-10 w-20" />
                                </div>
                            ))}
                    </div>
                    <Skeleton className="h-10 w-20" />
                </div>
                {Array(15)
                    .fill(null)
                    .map((_, index) => (
                        <div key={index} className="mx-auto my-4 flex flex-col items-center gap-10 ">
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ))}
            </Box>
        </div>
    )
}
