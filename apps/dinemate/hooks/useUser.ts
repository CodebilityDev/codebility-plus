"use client"
import { Types } from "mongoose"
import { create } from "zustand";

interface state {
  userId: string|null;
  tableId: string|null;
}

interface action {
  getLocalSession() : void;
}


// temporary only
const INITIAL_STATE : state = {
  userId: null,
  tableId: null
}


export const useUser = create<state & action>((set) => ({
  ...INITIAL_STATE,
  getLocalSession: () => {
    const userId = localStorage.getItem("userId")
    const tableId = localStorage.getItem("tableId")
    if (!userId || !tableId) {
      const userId = new Types.ObjectId().toHexString()
      const tableId = new Types.ObjectId().toHexString()  
      localStorage.setItem("userId", userId)
      localStorage.setItem("tableId", tableId)
      set({
        userId,
        tableId
      })  
    } else {
      set({
        userId,
        tableId
      }) 
    }
  }
}))