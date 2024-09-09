import { create } from "zustand";
import { Order } from "~/lib/dummyOrders";

interface State {
  orders: Order[];
}

interface Actions {
  setOrders: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  removeOrder: (orderId: string) => void;
}

const INITIAL_STATE: State = {
  orders: [],
};

export const useOrders = create<State & Actions>((set) => ({
  ...INITIAL_STATE,
  setOrders: (orders: Order[]) => set({ orders }),
  updateOrderStatus: (orderId: string, status: string) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.orderId === orderId ? { ...order, status } : order
      ),
    })),
  removeOrder: (orderId: string) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.orderId !== orderId),
    })),
}));
