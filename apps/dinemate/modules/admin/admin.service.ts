import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

export default class AdminService {
  private readonly url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin`

  adminLogin = async ({email,password}:{email:string;password:string}) => {
    try {
    const res = await axios.post<{code:string}>(`${this.url}/login`, {
      email,
      password
    })
    if (res.data.code) {
      setCookie('code', res.data.code, {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60
      })
    }
    return true
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  adminVerify = async () => {
    const code = getCookie("code")
    try {
    const res = await axios.post(`${this.url}/verify`, {
      code
    })    
    return res.status
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return error.response?.status
      }
      console.error(error)
    }
    
  }




}