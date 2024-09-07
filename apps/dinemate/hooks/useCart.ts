import { Cart, GenerateCartDto } from "@/modules/cart/cart.types";
import { create } from "zustand";
import { cartService } from "@/modules";

interface state {
  cart: Cart|null;
}

interface action {
  generateCart: (infos:GenerateCartDto) => void;
  setCart: (cart: state["cart"]) => void;
}

const INITIAL_STATE: state = {
  cart: null
}


export const useCart = create<state&action>(set => ({
  ...INITIAL_STATE,
  generateCart: async (infos) => {
    const cartStr = localStorage.getItem("cart")
    if (!cartStr) {
      const cart = await cartService.generateCart(infos)
      localStorage.setItem("cart", JSON.stringify(cart))
      if (cart) {
        set({ cart })
      }
    } else {
      const cart = JSON.parse(cartStr) as Cart
      set({cart})
    }
    
  },
  setCart: (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart))
    set({cart})
  }
}))