import axios from "axios";
import { IOrders, OrderStatus, CreateOrderDto } from "./orders.type";
import { getCookie, setCookie  } from "cookies-next"

export default class OrdersService {
  private readonly url = `${process.env.NEXT_PUBLIC_API_URL}/api/orders`

  getOrders = async () => {
    try {
    const res = await axios.get<IOrders[]>(`${this.url}/`)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  getOrder = async (orderId: string) => {
    try {
    const res = await axios.get<IOrders>(`${this.url}/${orderId}`)
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  getOrderStatus = async (orderId: string) => {
    try {
    const res = await axios.get<{status: OrderStatus}>(`${this.url}/${orderId}/status`, )
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  createOrder = async (newOrder:CreateOrderDto, cartId: string) => {
    try {
    const res = await axios.post<{sessionToken:string}>(`${this.url}/${cartId}`, newOrder, {
      withCredentials: true,
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getCookie("session")}`,
    },
    })
    // updates the token
    setCookie('session', res.data.sessionToken, {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60
    })
    return res.data;  
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
    }
    
  }

  updateOrderStatus = async (orderId:string,newStatus:OrderStatus) => {
    try {
      const res = await axios.patch(`${this.url}/${orderId}`, {
        status: newStatus
      })
      if (res.status !== 200) {
        return false
      }
      return true
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return false
      }
      console.error(error)
      return false
    }
  }

  getMostOrdered = async () => {
    try {
      const res = await axios.get<{mostOrdered:string|null;percent:number}>(`${this.url}/most-orders`)
      return res.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }
    
  }

  getTotalCustomers = async () => {
    try {
      const res = await axios.get<{users:number;percent:number}>(`${this.url}/total-customers`)
      return res.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }
    
  }

  getTotalBookings = async () => {
    try {
      const res = await axios.get<{users:number;percent:number}>(`${this.url}/total-bookings`)
      return res.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }   
  }

  getTotalBookingsToday = async () => {
    try {
      const res = await axios.get<{bookings:number}>(`${this.url}/total-bookings-today`)
      return res.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }   
  }

  getTotalSalesToday = async () => {
    try {
      const res = await axios.get<{totalSales:number;percent:number}>(`${this.url}/sales-today`)
      return res.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }   
  }

  getWeeklySales = async () => {
    try {
      const res = await axios.get<{day:number;current:number;previous:number}[]>(`${this.url}/sales-weekly`)
      return res.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }   
  }

  getTopDishesOfTheWeek = async () => {
    try {
      const res = await axios.get<{name:string;percent:number;menuId:string;amount:string}[]>(`${this.url}/top-dishes`)
      return res.data;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }   
  }

  markOrderAsPaid = async (orderId:string) => {
    try {
      const res = await axios.patch<{name:string;percent:number;menuId:string;amount:string}[]>(`${this.url}/${orderId}/paid`)
      return res.status;
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        console.error(error.response)
        return
      }
      console.error(error)
      return
    }   
  }


}