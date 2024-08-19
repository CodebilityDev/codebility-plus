"use client"
import React from "react"
import { useState } from "react"
import toast from "react-hot-toast"

import useToken from "@/hooks/use-token"
import useAuthCookie from "@/hooks/use-cookie"
import { toggleJobStatusType } from "@/app/api/dashboard"
import { dash_StatusT } from "@/types/protectedroutes"

const Status = ({ jobStatusType, userId }: dash_StatusT) => {
  const { token } = useToken()
  const auth = useAuthCookie()
  const [isChecked, setIsChecked] = useState(jobStatusType === "AVAILABLE")
  const [isLoading, setIsLoading] = useState(false)

  let statusText
  let statusColor

  const changeJobStatus = async (jobStatus: dash_StatusT["jobStatusType"], token: string) => {
    try {
      setIsLoading(true)
      const jobStatusToggle: any = await toggleJobStatusType(
        {
          id: userId,
          jobStatusType: jobStatus,
        },
        token
      )
      return { ...jobStatusToggle, status: true }
    } catch (e) {
      setIsLoading(false)
      return { status: false }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = async () => {
    const { status } = await changeJobStatus(isChecked ? "DEPLOYED" : "AVAILABLE", token)
    if (!status) {
      toast.error("Only the admin can make this action.")
      return
    }
    setIsChecked(!isChecked)
    toast.success("JobStatus successfully changed.")
  }

  if (!isChecked) {
    statusText = "Deployed"
    statusColor = "bg-orange-500"
  } else {
    statusText = "Available"
    statusColor = "bg-green-500"
  }

  return (
    <>
      <label
        className={`inline-flex cursor-pointer items-center ${
          isLoading || (auth?.data?.userType !== "ADMIN" && "pointer-events-none opacity-50")
        }`}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={isChecked}
          onChange={handleChange}
          disabled={isLoading || auth?.data?.userType !== "ADMIN"}
        />
        <div
          className={`peer relative h-9 w-24 rounded-full after:absolute after:left-1 after:top-1 after:h-7 after:w-7 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-[3.8rem] ${statusColor}`}
        >
          <span
            className={`absolute ${
              isChecked ? "left-[8%]" : "right-[8%]"
            } top-[50%] translate-y-[-52%] text-xs text-white`}
          >
            {statusText}
          </span>
        </div>
      </label>
    </>
  )
}

export default Status
