import axios from "axios";
import { AssistDto, AssistStatus, Assist } from "./assist.types";

export default class AssistService {
  private readonly url = `${process.env.NEXT_PUBLIC_API_URL}/api/assist`

  getAssistList = async () => {
    try {
    const res = await axios.get<Assist[]>(`${this.url}/`)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  getAssistItem = async (assistId: string) => {
    try {
    const res = await axios.get<Assist>(`${this.url}/${assistId}`)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  requestAssistance = async (assist: AssistDto) => {
    try {
    const res = await axios.post<Assist>(`${this.url}/`, assist)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  updateAssistStatus = async (assistId: string, status: AssistStatus) => {
    try {
    const res = await axios.patch<Assist>(`${this.url}/${assistId}`, {status})
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  getAssistStatus = async (userId: string) => {
    try {
    const res = await axios.get<{status:AssistStatus;id:string}[]>(`${this.url}/${userId}/status`)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }



}