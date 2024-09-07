"use client"
import { create } from "zustand"

interface state {
  sessionToken: string|null;
  tableSessionId: string|null;
  cartId: string|null;
  tableNumber: string|null;
  orderId: string|null;
  user: {
    TableSession: {
      access_code: string;
      createdAt: string;
      creator: string|null;
      expiresAt: string;
      members: string;
      tableId: string;
      updatedAt: string;
    };
    userData: {
      _id: string;
      createdAt: string;
      email: string;
      roles: string;
      tableSession: string;
      updatedAt: string;
      username: string;
    }
  }|null;
}

interface action {
  setCredentials(
    credentials    
  : {
    sessionToken: string;
    tableSessionId:string;
  }|null): void;

  setUser(user:state["user"]) : void;
  setCartId(cartId?:state["cartId"]) : void;
  setTableNumber(tableNumber:string) : void;
  setOrderId(orderId:string) : void;
}

const INITIAL_STATE : state = {
  sessionToken: null,
  tableSessionId: null,
  user: null,
  cartId: null,
  orderId: null,  
  tableNumber: "01", // for dev purposes
}

export const useGlobalStore = create<state&action>((set) => ({
  ...INITIAL_STATE,
  setCredentials: (credentials) =>
    set(() => ({
      sessionToken: credentials ? credentials.sessionToken : null,
      tableSessionId: credentials ? credentials.tableSessionId : null,
    })),
  setUser: (user) =>
    set(() => ({
      user: user ? user : null
    })),
  setCartId: (cartId) =>
    set(() => ({
      cartId: cartId ? cartId : null
    })),
  setTableNumber: (tableNumber) =>
    set(() => ({
      tableNumber
    })),
  setOrderId: (orderId) =>
    set(() => ({
      orderId
    }))
}))