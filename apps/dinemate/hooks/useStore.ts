import { OrderType } from "@/modules/cart/cart.types";
import { create } from "zustand";
import createAxiosInstance from "@/lib/apiRequests/Axios";


export type State = {
  session: {
    _id: string;
    access_code: string;
    cartId: string;
    createdAt: string;
    updatedAt: string;
    creator: string;
    expiresAt: string;
    members: string[];
    orderType: OrderType;
    tableId: string;
    tableNumber: string;
    user: {
      _id: string;
      createdAt: string;
      email: string;
      fullname: string;
      roles: "user"|"admin";
      updatedAt: string;
    }
    orderId: string;
  }|null
  
}

export type Action = {
  updateSession() : Promise<void>;
}

const INITIAL_STATE = {
  session: null
}

export const useStore = create<State&Action>(set => ({
  ...INITIAL_STATE,
  
  updateSession: async () => {
    const Axios = createAxiosInstance()
    console.log("updating session")
    const res = await Axios.get('/api/users/getSession')
    if (res.status === 200) {
      set(() => ({
        session: res.data
      }))      
      console.log("session updated")
    } else {
      console.log("session updated failed no session found")
    }
  }

}))
