'use client'

import {create} from 'zustand'

interface state {
  name: string;
  phone: string;
}

interface action {
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
}

const INITIAL_STATE: state = {
  name: '',
  phone: '',
}

export const useAccount = create<state & action>((set) => ({
  ...INITIAL_STATE,
  setName: (name: string) => set({name}),
  setPhone: (phone: string) => set({phone}),
}))
