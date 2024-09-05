import { NextResponse } from "next/server";
import { API } from "@/lib/constants";
import axios from "axios";

/* 

 ____                                     _    ____ ___ 
|  _ \ ___  ___ _   _ _ __ ___   ___     / \  |  _ \_ _|
| |_) / _ \/ __| | | | '_ ` _ \ / _ \   / _ \ | |_) | | 
|  _ <  __/\__ \ |_| | | | | | |  __/  / ___ \|  __/| | 
|_| \_\___||___/\__,_|_| |_| |_|\___| /_/   \_\_|  |___|

*/
export const updateProfile = async (id: string, data: any, token: string) => {
  try {
    const response = await axios.patch(`${API.TASKS}/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const getWorkExperiencesPerUser = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${API.CODEVS}/workexp/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const addWorkExperience = async (
  data: {
    position: string;
    short_desc: string;
    dateFrom: string;
    dateTo: string;
    userWorkExpId: string;
    company: string;
    location: string;
  },
  token: string,
) => {
  try {
    const response = await axios.post(`${API.CODEVS}/workexp`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const updateWorkExperience = async (
  data: {
    position: string;
    short_desc: string;
    dateFrom: string;
    dateTo: string;
    userWorkExpId: string;
    company: string;
    location: string;
  },
  token: string,
  id: string,
) => {
  try {
    const response = await axios.patch(`${API.CODEVS}/workexp/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error", error);
    throw new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const deleteWorkExperience = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${API.CODEVS}/workexp/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
