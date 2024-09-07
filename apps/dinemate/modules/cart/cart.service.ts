import axios from "axios";
import { Cart, GenerateCartDto, AddToCartDto } from "./cart.types";

export default class CartService {
  private readonly url = `${process.env.NEXT_PUBLIC_API_URL}/api/cart`

  getCart = async (cartId: string) => {
    try {
    const res = await axios.get<Cart>(`${this.url}/${cartId}`)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  getGroupCart = async (tableId: string) => {
    try {
    const res = await axios.get<Cart[]>(`${this.url}/${tableId}/group`)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  generateCart = async (generateCartDetails: GenerateCartDto) => {
    try {
    console.log("generating cart...")
    const res = await axios.post<Cart>(`${this.url}/`, generateCartDetails, {
      withCredentials: true,
    })
    console.log("cart generated")
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  addToCart = async (cartId: string, update: AddToCartDto) => {
    try {
    const res = await axios.patch<Cart>(`${this.url}/${cartId}`, update)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  clearCart = async (cartId: string) => {
    try {
      const res = await axios.delete(`${this.url}/${cartId}/clear`)
      if (res.status !== 200) {
        return false
      }
      return true
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return false
      }
    }
  }



}