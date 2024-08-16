import axios from "axios"
import { API } from "@/lib/constants"
import { NextResponse } from "next/server"
import { modals_ClientAddModal } from "@/types/components"

/* 

  ____ _ _            _            _    ____ ___ 
 / ___| (_) ___ _ __ | |_ ___     / \  |  _ \_ _|
| |   | | |/ _ \ '_ \| __/ __|   / _ \ | |_) | | 
| |___| | |  __/ | | | |_\__ \  / ___ \|  __/| | 
 \____|_|_|\___|_| |_|\__|___/ /_/   \_\_|  |___|

*/

export const getClients = async () => {
  try {
    const response = await axios.get(API.CLIENTS, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data.data
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export const createClient = async (data: modals_ClientAddModal, token: string) => {
  try {
    const response = await axios.post(`${API.CLIENTS}/create`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const { status, data: datas, statusText } = response
    return { status, data: datas, statusText }
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export const updateClient = async (id: string, data: modals_ClientAddModal, token: string) => {
  try {
    const response = await axios.patch(`${API.CLIENTS}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const { status, data: datas, statusText } = response
    return { status, data: datas, statusText }
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}

export const deleteClient = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API.CLIENTS}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}
