import { NextResponse } from "next/server";
import { API } from "@/lib/constants";
import axios from "axios";

/*

 ____            _     _                         _      _    ____ ___
|  _ \  __ _ ___| |__ | |__   ___   __ _ _ __ __| |    / \  |  _ \_ _|
| | | |/ _` / __| '_ \| '_ \ / _ \ / _` | '__/ _` |   / _ \ | |_) | |
| |_| | (_| \__ \ | | | |_) | (_) | (_| | | | (_| |  / ___ \|  __/| |
|____/ \__,_|___/_| |_|_.__/ \___/ \__,_|_|  \__,_| /_/   \_\_|  |___|

*/
export const toggleJobStatusType = async (
  data: { id: string; jobStatusType: "DEPLOYED" | "AVAILABLE" },
  token: string,
) => {
  try {
    const response = await axios.put(`${API.CODEVS}/changeJobStatus`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
};
