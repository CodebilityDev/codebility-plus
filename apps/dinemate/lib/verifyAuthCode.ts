import createAxiosInstance from "./apiRequests/Axios";
import Axios from "./apiRequests/Axios"
import {setCookie, getCookie} from 'cookies-next'

const verifyAuthCode = async(code: string, table: string) => {
  try {
    const Axios = createAxiosInstance(); 
    const res = await Axios.post('/api/codes/verifyCode', {code, table})
    
    setCookie('session', res.data.sessionToken, {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60
    })
    return {
      ...res.data,
      status: res.status
    }
  } catch (error: any) {
    return error.response.data
  }
}

export const updateSessionToken = async(orderId:string) => {
  const Axios = createAxiosInstance(); 

  try {
    const res = await Axios.post('/api/users/update-session', {orderId}, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getCookie("session")}`,
      },
    })
    if (res.data.sessionToken) {
      setCookie('session', res.data.sessionToken, {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60
      })
      return true
    }
    return false
  } catch (error) {
    console.error(error)
  }

}

export const updateSessionData = async() => {
  const Axios = createAxiosInstance(); 

  try {
    const res = await Axios.get('/api/users/update-session', {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getCookie("session")}`,
      },
    })
    if (res.data.sessionToken) {
      setCookie('session', res.data.sessionToken, {
        path: "/",
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60
      })
      return true
    }
    return false
  } catch (error) {
    console.error(error)
  }

}


  

export default verifyAuthCode