import axios from "axios"
import { API } from "@/lib/constants"
import { NextResponse } from "next/server"

export const getRoles = async () => {
  try {
    const response = await axios.get(API.ROLES, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data.data
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export const createRoles = async (data: any, token: string) => {
  try {
    const response = await axios.post(`${API.ROLES}/addrole`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error:", error)
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}
