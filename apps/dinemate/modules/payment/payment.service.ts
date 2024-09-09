import axios from "axios"
import { CreateOrderDto } from "../orders/orders.type";
import { getCookie } from "cookies-next";

interface IUnitAmount {
  currency_code: string;
  value: string;
}
export interface IOrder {
  name: string;
  unit_amount: IUnitAmount;
  quantity: number;
}

export interface IPayment {
  items: IOrder[];
  total: string;
}
export const paymentService = async (items: IOrder[], total: string, orderData:CreateOrderDto, cartId: string) => {
  try {
    
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment`, {
        items,
        total,
        orderData,
        cartId,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getCookie("session")}`,
        },
      })
      return response.data.link
  } catch (error) {
    return error
  }
}