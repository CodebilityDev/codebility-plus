"use server"

import axios from "axios"
import { API } from "@/lib/constants"
import { NextResponse } from "next/server"

/* 
    _                _ _                 _            _    ____ ___
   / \   _ __  _ __ | (_) ___ __ _ _ __ | |_ ___     / \  |  _ \_ _|
  / _ \ | '_ \| '_ \| | |/ __/ _` | '_ \| __/ __|   / _ \ | |_) | |
 / ___ \| |_) | |_) | | | (_| (_| | | | | |_\__ \  / ___ \|  __/| |
/_/   \_\ .__/| .__/|_|_|\___\__,_|_| |_|\__|___/ /_/   \_\_|  |___|
        |_|   |_|

*/

export const getApplicants = async () => {
  try {
    const response = await axios.get(API.APPLICANTS, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data.data
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export const approveApplicant = async (email_address: { email_address: string }, token: string) => {
  try {
    const response = await axios.post(API.APPROVE_APPLICANT, email_address, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const { status, statusText, data } = response
    return { status, statusText, data }
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export const denyApplicant = async (email_address: { email_address: string }, token: string) => {
  try {
    const response = await axios.post(API.DENY_APPLICANT, email_address, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const { status, statusText, data } = response
    return { status, statusText, data }
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}
