import axios from "axios"
import { API } from "@/lib/constants"
import { NextResponse } from "next/server"

/* 

 ___       _                           _    ____ ___ 
|_ _|_ __ | |_ ___ _ __ _ __  ___     / \  |  _ \_ _|
 | || '_ \| __/ _ \ '__| '_ \/ __|   / _ \ | |_) | | 
 | || | | | ||  __/ |  | | | \__ \  / ___ \|  __/| | 
|___|_| |_|\__\___|_|  |_| |_|___/ /_/   \_\_|  |___|

*/

export const getInterns = async () => {
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
