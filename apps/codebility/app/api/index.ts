import axios from "axios"
import { API } from "@/lib/constants"
import { NextResponse } from "next/server"

export const getAllAdmin = async () => {
  try {
    const response = await axios.get(API.ADMINS, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data.data
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export const getAllCodevs = async () => {
  try {
    const response = await axios.get(API.INTERNS, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data.data
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export async function getUserDataById(id: string) {
  try {
    const response = await fetch(`${API.CODEVS}/${id}`, {
      method: "GET",
    })
    return response.json()
  } catch (e: any) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}
