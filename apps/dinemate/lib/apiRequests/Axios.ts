import axios from "axios";
import { getCookie } from 'cookies-next';

const createAxiosInstance = () => {
  const session = getCookie('session');
  
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session}`,
    },
  });
};

export default createAxiosInstance;
