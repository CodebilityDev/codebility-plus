"use server";

import { NextResponse } from "next/server";
import { API } from "@/lib/constants";
import { formatToUnix } from "@/lib/format-date-time";
import axios from "axios";
import { FieldValues } from "react-hook-form";

/*
    _         _   _          _    ____ ___ 
   / \  _   _| |_| |__      / \  |  _ \_ _|
  / _ \| | | | __| '_ \    / _ \ | |_) | | 
 / ___ \ |_| | |_| | | |  / ___ \|  __/| | 
/_/   \_\__,_|\__|_| |_| /_/   \_\_|  |___|

*/

export const loginUser = async (data: FieldValues) => {
  try {
    const response = await axios.post(`${API.CODEVS}/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (e: any) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const signupUser = async (data: FieldValues) => {
  const [startTime, endTime] = data.schedule.split(" - ");
  const datas = {
    first_name: data.firstName,
    last_name: data.lastName,
    email_address: data.email_address,
    fb_link: data.facebook,
    ...(data.website !== "" && { portfolio_website: data.website }),
    tech_stacks: [...data.techstack.split(", ")],
    start_time: formatToUnix(startTime),
    end_time: formatToUnix(endTime),
    main_position: data.position,
    password: data.password,
  };

  try {
    const response = await axios.post(`${API.CODEVS}/register`, datas, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const getEmailForgotPassword = async (data: FieldValues) => {
  try {
    const response = await axios.post(`${API.CODEVS}/forgot-password`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (e) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};

export const getPasswordReset = async (data: FieldValues, token: any) => {
  try {
    const response = await axios.post(
      `${API.CODEVS}/reset-password/${token}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (e) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
