import { OrderType, CartContents } from "../cart/cart.types";


export interface IOrders {
  _id: string
  userId: string;
  tableNumber: string;
  members: string[];
  orderType: OrderType;
  orders: Orders;
  status: OrderStatus;
  totalBill: number;
  isPaid: boolean;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export type Orders = (CartContents & {userId:string})[]


export enum OrderStatus {
  Pending = "PENDING",
  Ongoing = "ONGOING",
  Completed = "COMPLETED",
  Served = "SERVED",
  Cancelled = "CANCELLED"
}


export interface CreateOrderDto {
  userId: string;
  tableNumber: string;
  members: string[];
  orderType: OrderType;
  orders: OrderDto[];
  paymentId?: string;  
}

export interface OrderDto {  
  menuId: string;
  amount: number;
  updatedAt: string;
  userId: string;
}
