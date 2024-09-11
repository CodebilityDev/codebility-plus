import axios from "axios"
import { ProjectT } from "@/types"
import { API } from "@/lib/constants"
import { NextResponse } from "next/server"

/* 

 ____            _           _            _    ____ ___ 
|  _ \ _ __ ___ (_) ___  ___| |_ ___     / \  |  _ \_ _|
| |_) | '__/ _ \| |/ _ \/ __| __/ __|   / _ \ | |_) | | 
|  __/| | | (_) | |  __/ (__| |_\__ \  / ___ \|  __/| | 
|_|   |_|  \___// |\___|\___|\__|___/ /_/   \_\_|  |___|
              |__/
              
*/
export const getProjects = async () => {
  try {
    const response = await axios.get(API.PROJECTS, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data.data
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 })
  }
}



export const createProjects = async (
  data: ProjectT,
  users: { id: string }[],
  token: string,
) => {
  try {
    const response = await axios.post(
      `${API.PROJECTS}/create`,
      { ...data, users },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { status, statusText, data: datas } = response;
    return { status, statusText, datas };
  } catch (error) {
    console.error("Error:", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const updateProjects = async (
  data: ProjectT,
  id: string,
  users: { id: string }[],
  usersId: { id: string }[],
  token: string,
) => {
  try {
    const response = await axios.patch(
      `${API.PROJECTS}/${id}`,
      { data, users, usersId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { status, statusText, data: datas } = response;
    return { status, statusText, datas };
  } catch (error) {
    console.error("Error:", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const deleteProjects = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API.PROJECTS}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}






